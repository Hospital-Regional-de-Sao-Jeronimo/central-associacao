import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BenefitCategory } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

@Injectable()
export class BenefitsService {
  constructor(private readonly prisma: PrismaService) {}

  private maskCpf(cpf?: string | null): string {
    if (!cpf) return 'Não informado';
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return '***.***.***-**';
    return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
  }

  private async syncPartnerAccess(
    benefitId: string,
    benefitName: string,
    benefitActive: boolean,
    accessEmail?: string,
    accessPassword?: string,
  ) {
    if (accessEmail === undefined) {
      // Apenas sincroniza status ativo/nome se já houver usuário vinculado
      await this.prisma.$executeRaw`
        UPDATE users
        SET name = ${benefitName},
            active = ${benefitActive},
            updated_at = NOW()
        WHERE partner_benefit_id = ${benefitId}
      `;
      return;
    }

    const cleanEmail = accessEmail.trim().toLowerCase();
    const cleanPass = accessPassword ? accessPassword.trim() : '';

    // Se o admin limpou o e-mail, remove o acesso vinculado a este parceiro
    if (!cleanEmail) {
      await this.prisma.$executeRaw`
        DELETE FROM users
        WHERE partner_benefit_id = ${benefitId} AND role::text = 'PARTNER'
      `;
      return;
    }

    // Verifica se o e-mail já está em uso por outro usuário
    const duplicateUsers = await this.prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM users
      WHERE email = ${cleanEmail}
        AND (partner_benefit_id IS NULL OR partner_benefit_id <> ${benefitId})
      LIMIT 1
    `;

    if (duplicateUsers.length > 0) {
      throw new BadRequestException(
        `O e-mail de acesso "${cleanEmail}" já está sendo utilizado por outro usuário ou parceiro.`,
      );
    }

    const existingPartnerUsers = await this.prisma.$queryRaw<Array<{ id: string; email: string }>>`
      SELECT id, email FROM users
      WHERE partner_benefit_id = ${benefitId}
      LIMIT 1
    `;

    if (existingPartnerUsers.length > 0) {
      const existingUser = existingPartnerUsers[0];
      if (cleanPass) {
        if (cleanPass.length < 6) {
          throw new BadRequestException('A senha de acesso do parceiro deve ter no mínimo 6 caracteres.');
        }
        const hashedPassword = await bcrypt.hash(cleanPass, 10);
        await this.prisma.$executeRaw`
          UPDATE users
          SET name = ${benefitName},
              email = ${cleanEmail},
              password = ${hashedPassword},
              active = ${benefitActive},
              updated_at = NOW()
          WHERE id = ${existingUser.id}
        `;
      } else {
        await this.prisma.$executeRaw`
          UPDATE users
          SET name = ${benefitName},
              email = ${cleanEmail},
              active = ${benefitActive},
              updated_at = NOW()
          WHERE id = ${existingUser.id}
        `;
      }
    } else {
      if (!cleanPass || cleanPass.length < 6) {
        throw new BadRequestException(
          'Para habilitar o login do parceiro pela primeira vez, informe uma senha com no mínimo 6 caracteres.',
        );
      }
      const hashedPassword = await bcrypt.hash(cleanPass, 10);
      const newUserId = randomUUID();
      await this.prisma.$executeRaw`
        INSERT INTO users (id, name, email, password, role, active, partner_benefit_id, created_at, updated_at)
        VALUES (
          ${newUserId},
          ${benefitName},
          ${cleanEmail},
          ${hashedPassword},
          CAST('PARTNER' AS "Role"),
          ${benefitActive},
          ${benefitId},
          NOW(),
          NOW()
        )
      `;
    }
  }

  private async enrichBenefitsWithMeta<T extends { id: string }>(benefits: T[]) {
    if (benefits.length === 0) return [];

    const userRows = await this.prisma.$queryRaw<
      Array<{ partner_benefit_id: string; email: string; active: boolean }>
    >`
      SELECT partner_benefit_id, email, active
      FROM users
      WHERE partner_benefit_id IS NOT NULL
    `;

    const countRows = await this.prisma.$queryRaw<
      Array<{ partner_benefit_id: string; total: bigint | number }>
    >`
      SELECT partner_benefit_id, COUNT(*)::int AS total
      FROM discount_usages
      GROUP BY partner_benefit_id
    `;

    const userMap = new Map(userRows.map((u) => [u.partner_benefit_id, u]));
    const countMap = new Map(countRows.map((c) => [c.partner_benefit_id, Number(c.total)]));

    return benefits.map((b) => {
      const linkedUser = userMap.get(b.id);
      return {
        ...b,
        accessEmail: linkedUser?.email || null,
        hasAccess: Boolean(linkedUser && linkedUser.active),
        redemptionsCount: countMap.get(b.id) || 0,
      };
    });
  }

  async create(createDto: CreateBenefitDto) {
    const created = await this.prisma.partnerBenefit.create({
      data: {
        name: createDto.name,
        category: createDto.category,
        discountPercentage: createDto.discountPercentage,
        description: createDto.description || null,
        location: createDto.location,
        phone: createDto.phone || null,
        website: createDto.website || null,
        imageUrl: createDto.imageUrl || null,
        active: createDto.active ?? true,
      },
    });

    if (createDto.accessEmail && createDto.accessEmail.trim()) {
      try {
        await this.syncPartnerAccess(
          created.id,
          created.name,
          created.active,
          createDto.accessEmail,
          createDto.accessPassword,
        );
      } catch (err) {
        // Reverte criação do parceiro caso e-mail/senha sejam inválidos
        await this.prisma.partnerBenefit.delete({ where: { id: created.id } });
        throw err;
      }
    }

    const [enriched] = await this.enrichBenefitsWithMeta([created]);
    return enriched;
  }

  async findAll(search?: string, category?: BenefitCategory, active?: boolean) {
    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (typeof active === 'boolean') {
      where.active = active;
    }

    const list = await this.prisma.partnerBenefit.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return this.enrichBenefitsWithMeta(list);
  }

  getCategories() {
    return [
      { key: BenefitCategory.ALIMENTACAO, label: 'Alimentação & Gastronomia' },
      { key: BenefitCategory.SAUDE, label: 'Saúde & Bem-Estar' },
      { key: BenefitCategory.LAZER, label: 'Lazer & Entretenimento' },
      { key: BenefitCategory.EDUCACAO, label: 'Educação & Cursos' },
      { key: BenefitCategory.SERVICOS, label: 'Serviços Especializados' },
      { key: BenefitCategory.VAREJO, label: 'Varejo & Compras' },
      { key: BenefitCategory.OUTROS, label: 'Outros Benefícios' },
    ];
  }

  async findOne(id: string) {
    const benefit = await this.prisma.partnerBenefit.findFirst({
      where: { id, deletedAt: null },
    });

    if (!benefit) {
      throw new NotFoundException(`Benefício com ID "${id}" não foi encontrado.`);
    }

    const [enriched] = await this.enrichBenefitsWithMeta([benefit]);
    return enriched;
  }

  async update(id: string, updateDto: UpdateBenefitDto) {
    const current = await this.findOne(id);

    const { accessEmail, accessPassword, ...benefitData } = updateDto;

    await this.syncPartnerAccess(
      id,
      benefitData.name ?? current.name,
      benefitData.active ?? current.active,
      accessEmail,
      accessPassword,
    );

    const updated = await this.prisma.partnerBenefit.update({
      where: { id },
      data: benefitData,
    });

    const [enriched] = await this.enrichBenefitsWithMeta([updated]);
    return enriched;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.$executeRaw`
      UPDATE users
      SET active = false, updated_at = NOW()
      WHERE partner_benefit_id = ${id}
    `;

    return this.prisma.partnerBenefit.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        active: false,
      },
    });
  }

  async redeemDiscount(payload: {
    associateId: string;
    partnerBenefitId: string;
    notes?: string;
  }) {
    const { associateId, partnerBenefitId, notes } = payload;

    if (!associateId || !partnerBenefitId) {
      throw new BadRequestException('Associado e estabelecimento parceiro são obrigatórios.');
    }

    const associate = await this.prisma.associate.findFirst({
      where: { id: associateId, deletedAt: null },
    });

    if (!associate) {
      throw new NotFoundException('Associado não encontrado.');
    }

    if (!associate.active) {
      throw new BadRequestException(
        'Este associado encontra-se INATIVO e não está apto a receber descontos no momento.',
      );
    }

    const benefit = await this.prisma.partnerBenefit.findFirst({
      where: { id: partnerBenefitId, deletedAt: null },
    });

    if (!benefit || !benefit.active) {
      throw new BadRequestException('Estabelecimento parceiro não encontrado ou inativo.');
    }

    const usageId = randomUUID();
    const cleanNotes = notes && notes.trim() ? notes.trim() : null;

    await this.prisma.$executeRaw`
      INSERT INTO discount_usages (id, associate_id, partner_benefit_id, discount_applied, notes, created_at)
      VALUES (
        ${usageId},
        ${associate.id},
        ${benefit.id},
        ${benefit.discountPercentage},
        ${cleanNotes},
        NOW()
      )
    `;

    return {
      id: usageId,
      associateId: associate.id,
      associateName: associate.name,
      associateMaskedCpf: this.maskCpf(associate.cpf),
      associateCardNumber: associate.cardNumber,
      partnerBenefitId: benefit.id,
      partnerName: benefit.name,
      discountApplied: benefit.discountPercentage,
      notes: cleanNotes,
      createdAt: new Date().toISOString(),
    };
  }

  async getRedemptions(partnerBenefitId?: string, limit: number = 50) {
    const safeLimit = Math.max(1, Math.min(200, Number(limit) || 50));

    const rows = partnerBenefitId
      ? await this.prisma.$queryRaw<
          Array<{
            id: string;
            associate_id: string;
            associate_name: string;
            associate_cpf: string | null;
            associate_card_number: string | null;
            partner_benefit_id: string;
            partner_name: string;
            discount_applied: string;
            notes: string | null;
            created_at: Date;
          }>
        >`
          SELECT
            du.id,
            du.associate_id,
            a.name AS associate_name,
            a.cpf AS associate_cpf,
            a.card_number AS associate_card_number,
            du.partner_benefit_id,
            pb.name AS partner_name,
            du.discount_applied,
            du.notes,
            du.created_at
          FROM discount_usages du
          INNER JOIN associates a ON a.id = du.associate_id
          INNER JOIN partner_benefits pb ON pb.id = du.partner_benefit_id
          WHERE du.partner_benefit_id = ${partnerBenefitId}
          ORDER BY du.created_at DESC
          LIMIT ${safeLimit}
        `
      : await this.prisma.$queryRaw<
          Array<{
            id: string;
            associate_id: string;
            associate_name: string;
            associate_cpf: string | null;
            associate_card_number: string | null;
            partner_benefit_id: string;
            partner_name: string;
            discount_applied: string;
            notes: string | null;
            created_at: Date;
          }>
        >`
          SELECT
            du.id,
            du.associate_id,
            a.name AS associate_name,
            a.cpf AS associate_cpf,
            a.card_number AS associate_card_number,
            du.partner_benefit_id,
            pb.name AS partner_name,
            du.discount_applied,
            du.notes,
            du.created_at
          FROM discount_usages du
          INNER JOIN associates a ON a.id = du.associate_id
          INNER JOIN partner_benefits pb ON pb.id = du.partner_benefit_id
          ORDER BY du.created_at DESC
          LIMIT ${safeLimit}
        `;

    return rows.map((r) => ({
      id: r.id,
      associateId: r.associate_id,
      associateName: r.associate_name,
      associateMaskedCpf: this.maskCpf(r.associate_cpf),
      associateCardNumber: r.associate_card_number,
      partnerBenefitId: r.partner_benefit_id,
      partnerName: r.partner_name,
      discountApplied: r.discount_applied,
      notes: r.notes,
      createdAt: r.created_at,
    }));
  }
}

