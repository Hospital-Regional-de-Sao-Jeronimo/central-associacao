import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PrismaService } from '../prisma/prisma.service';
import { LdapService, normalizeDepartmentName } from '../ldap/ldap.service';
import { CreateAssociateDto } from './dto/create-associate.dto';
import { UpdateAssociateDto } from './dto/update-associate.dto';

@Injectable()
export class AssociatesService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ldapService: LdapService,
  ) {}

  async onModuleInit() {
    this.normalizeAllExistingAddresses().catch((err) =>
      console.error('Erro ao normalizar setores existentes:', err),
    );
  }

  private async normalizeAllExistingAddresses() {
    const associates = await this.prisma.associate.findMany({
      select: { id: true, address: true },
    });

    for (const assoc of associates) {
      if (assoc.address) {
        const norm = normalizeDepartmentName(assoc.address);
        const newAddress = `Departamento: ${norm}`;
        if (assoc.address !== newAddress) {
          await this.prisma.associate.update({
            where: { id: assoc.id },
            data: { address: newAddress },
          });
        }
      }
    }
  }

  private cleanCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  async create(createDto: CreateAssociateDto) {
    const cleanedCpf = createDto.cpf && createDto.cpf.trim() ? this.cleanCpf(createDto.cpf) : null;
    const emailClean = createDto.email && createDto.email.trim() ? createDto.email.toLowerCase().trim() : null;
    const cardNumber = createDto.cardNumber?.trim() || null;

    let cardRetrievedAt: Date | null = null;
    if (createDto.cardRetrieved) {
      cardRetrievedAt = createDto.cardRetrievedAt ? new Date(createDto.cardRetrievedAt) : new Date();
    }

    const birthDate = createDto.birthDate ? new Date(createDto.birthDate) : null;
    const admissionDate = createDto.admissionDate ? new Date(createDto.admissionDate) : null;
    const associationDate = createDto.associationDate ? new Date(createDto.associationDate) : null;
    const address = createDto.address
      ? createDto.address.startsWith('Departamento: ')
        ? createDto.address
        : `Departamento: ${normalizeDepartmentName(createDto.address)}`
      : null;

    // Check CPF duplicate if provided
    if (cleanedCpf) {
      const existingCpf = await this.prisma.associate.findFirst({
        where: { cpf: cleanedCpf },
      });
      if (existingCpf) {
        if (existingCpf.deletedAt) {
          return this.prisma.associate.update({
            where: { id: existingCpf.id },
            data: {
              name: createDto.name,
              email: emailClean,
              phone: createDto.phone || null,
              birthDate,
              address,
              admissionDate,
              associationDate,
              cardNumber,
              cardRetrieved: createDto.cardRetrieved ?? false,
              cardRetrievedAt,
              active: createDto.active ?? true,
              deletedAt: null,
            },
          });
        }
        throw new BadRequestException(`Já existe um associado cadastrado com o CPF "${createDto.cpf}".`);
      }
    }

    // Check Email duplicate if provided
    if (emailClean) {
      const existingEmail = await this.prisma.associate.findFirst({
        where: { email: emailClean },
      });
      if (existingEmail) {
        if (existingEmail.deletedAt) {
          return this.prisma.associate.update({
            where: { id: existingEmail.id },
            data: {
              name: createDto.name,
              cpf: cleanedCpf,
              phone: createDto.phone || null,
              birthDate,
              address,
              admissionDate,
              associationDate,
              cardNumber,
              cardRetrieved: createDto.cardRetrieved ?? false,
              cardRetrievedAt,
              active: createDto.active ?? true,
              deletedAt: null,
            },
          });
        }
        throw new BadRequestException(`Já existe um associado cadastrado com o e-mail "${createDto.email}".`);
      }
    }

    if (cardNumber) {
      const existingCard = await this.prisma.associate.findFirst({
        where: { cardNumber },
      });
      if (existingCard && !existingCard.deletedAt) {
        throw new BadRequestException('Já existe um associado cadastrado com este número de carteirinha.');
      }
    }

    return this.prisma.associate.create({
      data: {
        name: createDto.name,
        cpf: cleanedCpf,
        email: emailClean,
        phone: createDto.phone || null,
        birthDate,
        address,
        admissionDate,
        associationDate,
        cardNumber,
        cardRetrieved: createDto.cardRetrieved ?? false,
        cardRetrievedAt,
        active: createDto.active ?? true,
      },
    });
  }

  async findAll(
    search?: string,
    active?: boolean,
    cardRetrieved?: boolean,
    department?: string,
    birthDate?: string,
    admissionDate?: string,
    letter?: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const where: any = {
      deletedAt: null,
    };

    if (search && search.trim()) {
      const searchTerm = search.trim();
      const cleanSearch = this.cleanCpf(searchTerm);

      if (searchTerm.length === 1) {
        where.OR = [
          { name: { startsWith: searchTerm, mode: 'insensitive' } },
          { name: { contains: ` ${searchTerm}`, mode: 'insensitive' } },
          { email: { startsWith: searchTerm, mode: 'insensitive' } },
          { cardNumber: { startsWith: searchTerm, mode: 'insensitive' } },
          { cpf: { startsWith: cleanSearch || searchTerm } },
        ];
      } else {
        const orConditions: any[] = [
          { name: { startsWith: searchTerm, mode: 'insensitive' } },
          { name: { contains: ` ${searchTerm}`, mode: 'insensitive' } },
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { cardNumber: { contains: searchTerm, mode: 'insensitive' } },
        ];

        if (cleanSearch) {
          orConditions.push({ cpf: { contains: cleanSearch } });
        } else {
          orConditions.push({ cpf: { contains: searchTerm } });
        }

        where.OR = orConditions;
      }
    }

    if (letter && letter.trim() && letter !== 'all') {
      where.name = { startsWith: letter.trim(), mode: 'insensitive' };
    }

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (typeof cardRetrieved === 'boolean') {
      where.cardRetrieved = cardRetrieved;
    }

    if (department && department.trim() && department !== 'all') {
      const targetNorm = normalizeDepartmentName(department);
      where.address = { contains: targetNorm, mode: 'insensitive' };
    }

    if (birthDate && birthDate.trim()) {
      const dateParts = birthDate.trim().split('-');
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const day = parseInt(dateParts[2], 10);
        const start = new Date(Date.UTC(year, month, day - 1, 12, 0, 0, 0));
        const end = new Date(Date.UTC(year, month, day + 1, 12, 0, 0, 999));
        where.birthDate = { gte: start, lte: end };
      }
    }

    if (admissionDate && admissionDate.trim()) {
      const dateParts = admissionDate.trim().split('-');
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const day = parseInt(dateParts[2], 10);
        const start = new Date(Date.UTC(year, month, day - 1, 12, 0, 0, 0));
        const end = new Date(Date.UTC(year, month, day + 1, 12, 0, 0, 999));
        where.admissionDate = { gte: start, lte: end };
      }
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100000, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [total, data] = await Promise.all([
      this.prisma.associate.count({ where }),
      this.prisma.associate.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { name: 'asc' },
      }),
    ]);

    const totalPages = total > 0 ? Math.ceil(total / limitNum) : 1;

    return {
      data,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  private maskCpf(cpf?: string | null): string {
    if (!cpf) return 'Não informado';
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return '***.***.***-**';
    return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
  }

  async findAllForPartner(
    search?: string,
    active?: boolean,
    page: number = 1,
    limit: number = 15,
    partnerBenefitId?: string,
  ) {
    const where: any = {
      deletedAt: null,
    };

    if (search && search.trim()) {
      const searchTerm = search.trim();
      const cleanSearch = this.cleanCpf(searchTerm);

      const orConditions: any[] = [
        { name: { startsWith: searchTerm, mode: 'insensitive' } },
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { cardNumber: { contains: searchTerm, mode: 'insensitive' } },
      ];

      if (cleanSearch) {
        orConditions.push({ cpf: { contains: cleanSearch } });
      } else {
        orConditions.push({ cpf: { contains: searchTerm } });
      }

      where.OR = orConditions;
    }

    if (typeof active === 'boolean') {
      where.active = active;
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(limit) || 15));
    const skip = (pageNum - 1) * limitNum;

    const [total, rawAssociates] = await Promise.all([
      this.prisma.associate.count({ where }),
      this.prisma.associate.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          cpf: true,
          cardNumber: true,
          active: true,
          associationDate: true,
        },
      }),
    ]);

    const usageMap = new Map<string, { lastUsedAt: Date; usageCount: number }>();

    if (partnerBenefitId && rawAssociates.length > 0) {
      const stats = await this.prisma.$queryRaw<
        Array<{ associate_id: string; last_used_at: Date; usage_count: number }>
      >`
        SELECT
          associate_id,
          MAX(created_at) AS last_used_at,
          COUNT(*)::int AS usage_count
        FROM discount_usages
        WHERE partner_benefit_id = ${partnerBenefitId}
        GROUP BY associate_id
      `;

      for (const s of stats) {
        usageMap.set(s.associate_id, {
          lastUsedAt: s.last_used_at,
          usageCount: Number(s.usage_count),
        });
      }
    }

    const data = rawAssociates.map((a) => {
      const u = usageMap.get(a.id);
      return {
        id: a.id,
        name: a.name,
        maskedCpf: this.maskCpf(a.cpf),
        cardNumber: a.cardNumber,
        active: a.active,
        associationDate: a.associationDate,
        lastUsedAt: u?.lastUsedAt || null,
        usageCount: u?.usageCount || 0,
      };
    });

    const totalPages = total > 0 ? Math.ceil(total / limitNum) : 1;

    return {
      data,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  async getDepartments(): Promise<string[]> {
    const associates = await this.prisma.associate.findMany({
      where: { deletedAt: null },
      select: { address: true },
      distinct: ['address'],
    });

    const depts = new Set<string>();
    for (const a of associates) {
      if (a.address) {
        if (a.address.startsWith('Departamento: ')) {
          depts.add(a.address.replace('Departamento: ', '').trim());
        } else {
          depts.add(a.address.trim());
        }
      }
    }
    return Array.from(depts).sort();
  }

  async findOne(id: string) {
    const associate = await this.prisma.associate.findFirst({
      where: { id, deletedAt: null },
    });

    if (!associate) {
      throw new NotFoundException(`Associado com ID "${id}" não foi encontrado.`);
    }

    return associate;
  }

  async update(id: string, updateDto: UpdateAssociateDto) {
    await this.findOne(id);

    const data: any = { ...updateDto };

    if (updateDto.cpf !== undefined) {
      data.cpf = updateDto.cpf && updateDto.cpf.trim() ? this.cleanCpf(updateDto.cpf) : null;
      if (data.cpf) {
        const existingCpf = await this.prisma.associate.findFirst({
          where: { cpf: data.cpf, id: { not: id } },
        });
        if (existingCpf) {
          throw new BadRequestException('Outro associado já utiliza este CPF.');
        }
      }
    }

    if (updateDto.email !== undefined) {
      data.email = updateDto.email && updateDto.email.trim() ? updateDto.email.toLowerCase().trim() : null;
      if (data.email) {
        const existingEmail = await this.prisma.associate.findFirst({
          where: { email: data.email, id: { not: id } },
        });
        if (existingEmail) {
          throw new BadRequestException('Outro associado já utiliza este e-mail.');
        }
      }
    }

    if (updateDto.birthDate !== undefined) {
      data.birthDate = updateDto.birthDate ? new Date(updateDto.birthDate) : null;
    }
    if (updateDto.admissionDate !== undefined) {
      data.admissionDate = updateDto.admissionDate ? new Date(updateDto.admissionDate) : null;
    }
    if (updateDto.associationDate !== undefined) {
      data.associationDate = updateDto.associationDate ? new Date(updateDto.associationDate) : null;
    }
    if (updateDto.address !== undefined) {
      data.address = updateDto.address
        ? updateDto.address.startsWith('Departamento: ')
          ? updateDto.address
          : `Departamento: ${normalizeDepartmentName(updateDto.address)}`
        : null;
    }

    if (updateDto.cardNumber !== undefined) {
      data.cardNumber = updateDto.cardNumber?.trim() || null;
      if (data.cardNumber) {
        const existingCard = await this.prisma.associate.findFirst({
          where: { cardNumber: data.cardNumber, id: { not: id } },
        });
        if (existingCard) {
          throw new BadRequestException('Outro associado já utiliza este número de carteirinha.');
        }
      }
    }

    if (updateDto.birthDate) data.birthDate = new Date(updateDto.birthDate);
    if (updateDto.admissionDate) data.admissionDate = new Date(updateDto.admissionDate);
    if (updateDto.associationDate) data.associationDate = new Date(updateDto.associationDate);

    if (updateDto.cardRetrieved !== undefined) {
      if (updateDto.cardRetrieved) {
        data.cardRetrievedAt = updateDto.cardRetrievedAt ? new Date(updateDto.cardRetrievedAt) : new Date();
      } else {
        data.cardRetrievedAt = null;
      }
    }

    return this.prisma.associate.update({
      where: { id },
      data,
    });
  }

  async toggleCardRetrieved(id: string, cardRetrieved?: boolean) {
    const associate = await this.findOne(id);
    const nextState = cardRetrieved !== undefined ? cardRetrieved : !associate.cardRetrieved;

    return this.prisma.associate.update({
      where: { id },
      data: {
        cardRetrieved: nextState,
        cardRetrievedAt: nextState ? new Date() : null,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.associate.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        active: false,
      },
    });
  }

  async importAllFromLdap() {
    const ldapUsers = await this.ldapService.fetchAllLdapUsers();
    const existingAssociates = await this.prisma.associate.findMany();

    const cpfMap = new Map<string, any>();
    const emailMap = new Map<string, any>();

    for (const assoc of existingAssociates) {
      if (assoc.cpf) {
        cpfMap.set(assoc.cpf, assoc);
      }
      if (assoc.email) {
        emailMap.set(assoc.email.toLowerCase().trim(), assoc);
      }
    }

    let imported = 0;
    let skipped = 0;
    let reactivated = 0;
    const errors: string[] = [];

    const today = new Date();
    const defaultBirthDate = new Date('1990-01-01');

    for (const user of ldapUsers) {
      if (!user.cpf) {
        continue;
      }

      const cleanCpf = this.cleanCpf(user.cpf);
      if (cleanCpf.length !== 11) {
        continue; // Ignora contas sem CPF ou contas de sistema/impressoras
      }

      let email = user.email?.toLowerCase().trim();
      if (!email) {
        email = `${user.username.toLowerCase().trim()}@hsjeronimo.com.br`;
      }

      const existing = cpfMap.get(cleanCpf) || emailMap.get(email);

      const address = user.departamento
        ? `Departamento: ${user.departamento}`
        : 'Hospital Regional São Jerônimo';

      if (existing) {
        if (existing.deletedAt) {
          try {
            await this.prisma.associate.update({
              where: { id: existing.id },
              data: {
                name: user.nome_completo || existing.name,
                phone: user.telefone || existing.phone,
                address,
                active: true,
                deletedAt: null,
              },
            });
            reactivated++;
            existing.deletedAt = null;
            existing.active = true;
          } catch (err: any) {
            errors.push(`Erro ao reativar ${user.nome_completo} (${cleanCpf}): ${err.message}`);
          }
        } else {
          skipped++;
        }
      } else {
        let finalEmail = email;
        if (emailMap.has(finalEmail) && !cpfMap.has(cleanCpf)) {
          finalEmail = `${user.username.toLowerCase().trim()}.${cleanCpf.slice(-4)}@hsjeronimo.com.br`;
        }

        try {
          const created = await this.prisma.associate.create({
            data: {
              name: user.nome_completo,
              cpf: cleanCpf,
              email: finalEmail,
              phone: user.telefone || null,
              address,
              birthDate: defaultBirthDate,
              admissionDate: today,
              associationDate: today,
              active: true,
              cardRetrieved: false,
            },
          });
          imported++;
          cpfMap.set(cleanCpf, created);
          emailMap.set(finalEmail, created);
        } catch (err: any) {
          errors.push(`Erro ao importar ${user.nome_completo} (${cleanCpf}): ${err.message}`);
        }
      }
    }

    return {
      totalLdap: ldapUsers.length,
      imported,
      skipped,
      reactivated,
      errors,
    };
  }

  async generateAssociatesPdf(options: {
    search?: string;
    active?: boolean;
    partnerName?: string;
  }): Promise<Buffer> {
    const where: any = {
      deletedAt: null,
    };

    if (options.search && options.search.trim()) {
      const searchTerm = options.search.trim();
      const cleanSearch = this.cleanCpf(searchTerm);

      const orConditions: any[] = [
        { name: { startsWith: searchTerm, mode: 'insensitive' } },
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { cardNumber: { contains: searchTerm, mode: 'insensitive' } },
      ];

      if (cleanSearch) {
        orConditions.push({ cpf: { contains: cleanSearch } });
      } else {
        orConditions.push({ cpf: { contains: searchTerm } });
      }

      where.OR = orConditions;
    }

    if (typeof options.active === 'boolean') {
      where.active = options.active;
    }

    const associates = await this.prisma.associate.findMany({
      where,
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        cpf: true,
        cardNumber: true,
        active: true,
      },
    });

    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({
        margin: 36,
        size: 'A4',
        bufferPages: true,
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const leftMargin = 36;
      const contentWidth = pageWidth - leftMargin * 2;

      const colSeqWidth = 28;
      const colNameWidth = 240;
      const colCpfWidth = 100;
      const colCardWidth = 85;
      const colStatusWidth = 70;
      const rowHeight = 16;
      const maxY = doc.page.height - 45;

      const drawHeader = (isFirstPage: boolean) => {
        if (isFirstPage) {
          doc
            .font('Helvetica-Bold')
            .fontSize(13)
            .fillColor('#0f172a')
            .text('ASSOCIAÇÃO DOS FUNCIONÁRIOS DO HRSJ', leftMargin, 36, { align: 'center' });

          doc
            .font('Helvetica')
            .fontSize(9)
            .fillColor('#475569')
            .text('Relação Oficial de Associados Elegíveis para Convênios e Benefícios', { align: 'center' });

          doc.moveDown(0.3);

          const nowStr = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
          let metaText = `Emissão: ${nowStr} • Total Listado: ${associates.length} associados`;
          if (options.partnerName) {
            metaText += ` • Estabelecimento: ${options.partnerName}`;
          }
          doc
            .font('Helvetica')
            .fontSize(7.5)
            .fillColor('#64748b')
            .text(metaText, { align: 'center' });

          doc.moveDown(0.5);

          // LGPD Notice Box
          const boxY = doc.y;
          const boxHeight = 32;
          doc
            .rect(leftMargin, boxY, contentWidth, boxHeight)
            .fillAndStroke('#eff6ff', '#bfdbfe');

          doc
            .font('Helvetica-Bold')
            .fontSize(7.2)
            .fillColor('#1e40af')
            .text('TERMO DE CONFORMIDADE LGPD (Lei nº 13.709/2018):', leftMargin + 8, boxY + 5, {
              continued: true,
            })
            .font('Helvetica')
            .fillColor('#1e3a8a')
            .text(
              ' Documento confidencial de uso exclusivo para conferência de associados em estabelecimentos conveniados. Proibido repasse ou divulgação externa. CPFs parcialmente mascarados para proteção dos titulares.',
              { lineGap: 1 }
            );

          doc.y = boxY + boxHeight + 8;
        } else {
          doc
            .font('Helvetica-Bold')
            .fontSize(8)
            .fillColor('#475569')
            .text('ASSOCIAÇÃO DOS FUNCIONÁRIOS DO HRSJ • Relação de Associados (Continuação)', leftMargin, 32);

          doc.y = 46;
        }

        // Table Header
        const tableHeaderY = doc.y;
        doc
          .rect(leftMargin, tableHeaderY, contentWidth, 18)
          .fill('#1e293b');

        doc
          .font('Helvetica-Bold')
          .fontSize(8)
          .fillColor('#ffffff');

        doc.text('#', leftMargin + 5, tableHeaderY + 5, { width: colSeqWidth, lineBreak: false });
        doc.text('Nome do Associado', leftMargin + colSeqWidth + 5, tableHeaderY + 5, { width: colNameWidth, lineBreak: false });
        doc.text('CPF', leftMargin + colSeqWidth + colNameWidth + 3, tableHeaderY + 5, { width: colCpfWidth, lineBreak: false });
        doc.text('Carteirinha', leftMargin + colSeqWidth + colNameWidth + colCpfWidth + 3, tableHeaderY + 5, { width: colCardWidth, lineBreak: false });
        doc.text('Situação', leftMargin + colSeqWidth + colNameWidth + colCpfWidth + colCardWidth + 3, tableHeaderY + 5, { width: colStatusWidth, lineBreak: false });

        doc.y = tableHeaderY + 18;
      };

      // Start drawing
      drawHeader(true);

      associates.forEach((assoc, index) => {
        if (doc.y + rowHeight > maxY) {
          doc.addPage();
          drawHeader(false);
        }

        const currentY = doc.y;
        const isEven = index % 2 === 0;

        if (isEven) {
          doc
            .rect(leftMargin, currentY, contentWidth, rowHeight)
            .fill('#f8fafc');
        }

        doc
          .strokeColor('#f1f5f9')
          .lineWidth(0.5)
          .moveTo(leftMargin, currentY + rowHeight)
          .lineTo(leftMargin + contentWidth, currentY + rowHeight)
          .stroke();

        doc.font('Helvetica').fontSize(7.2).fillColor('#64748b');
        doc.text(String(index + 1), leftMargin + 5, currentY + 4, { width: colSeqWidth, lineBreak: false });

        doc.font('Helvetica-Bold').fontSize(7.5).fillColor('#1e293b');
        doc.text(assoc.name || 'Sem nome', leftMargin + colSeqWidth + 5, currentY + 4, {
          width: colNameWidth - 10,
          lineBreak: false,
          ellipsis: true,
        });

        doc.font('Helvetica').fontSize(7.2).fillColor('#334155');
        const masked = this.maskCpf(assoc.cpf);
        doc.text(masked, leftMargin + colSeqWidth + colNameWidth + 3, currentY + 4, { width: colCpfWidth, lineBreak: false });

        const card = assoc.cardNumber ? assoc.cardNumber.trim() : '-';
        doc.text(card, leftMargin + colSeqWidth + colNameWidth + colCpfWidth + 3, currentY + 4, { width: colCardWidth, lineBreak: false });

        const isActive = assoc.active;
        if (isActive) {
          doc.font('Helvetica-Bold').fontSize(7.2).fillColor('#15803d');
          doc.text('ATIVO', leftMargin + colSeqWidth + colNameWidth + colCpfWidth + colCardWidth + 3, currentY + 4, { lineBreak: false });
        } else {
          doc.font('Helvetica-Bold').fontSize(7.2).fillColor('#b91c1c');
          doc.text('INATIVO', leftMargin + colSeqWidth + colNameWidth + colCpfWidth + colCardWidth + 3, currentY + 4, { lineBreak: false });
        }

        doc.y = currentY + rowHeight;
      });

      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        const oldBottomMargin = doc.page.margins.bottom;
        doc.page.margins.bottom = 0;
        doc
          .font('Helvetica')
          .fontSize(6.8)
          .fillColor('#94a3b8')
          .text(
            `Página ${i + 1} de ${range.count} • Associação dos Funcionários do HRSJ • Uso Restrito para Convênios (LGPD)`,
            leftMargin,
            doc.page.height - 25,
            { align: 'center', width: contentWidth, lineBreak: false }
          );
        doc.page.margins.bottom = oldBottomMargin;
      }

      doc.end();
    });
  }
}
