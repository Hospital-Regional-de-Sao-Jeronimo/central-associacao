import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
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

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Math.min(100, Number(limit) || 10));
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
}
