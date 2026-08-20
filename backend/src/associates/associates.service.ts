import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssociateDto } from './dto/create-associate.dto';
import { UpdateAssociateDto } from './dto/update-associate.dto';

@Injectable()
export class AssociatesService {
  constructor(private readonly prisma: PrismaService) {}

  private cleanCpf(cpf: string): string {
    return cpf.replace(/\D/g, '');
  }

  async create(createDto: CreateAssociateDto) {
    const cleanedCpf = this.cleanCpf(createDto.cpf);

    const existingCpf = await this.prisma.associate.findFirst({
      where: { cpf: cleanedCpf, deletedAt: null },
    });
    if (existingCpf) {
      throw new BadRequestException('Já existe um associado cadastrado com este CPF.');
    }

    const existingEmail = await this.prisma.associate.findFirst({
      where: { email: createDto.email, deletedAt: null },
    });
    if (existingEmail) {
      throw new BadRequestException('Já existe um associado cadastrado com este e-mail.');
    }

    let cardRetrievedAt: Date | null = null;
    if (createDto.cardRetrieved) {
      cardRetrievedAt = createDto.cardRetrievedAt ? new Date(createDto.cardRetrievedAt) : new Date();
    }

    return this.prisma.associate.create({
      data: {
        name: createDto.name,
        cpf: cleanedCpf,
        email: createDto.email,
        phone: createDto.phone || null,
        birthDate: new Date(createDto.birthDate),
        address: createDto.address,
        admissionDate: new Date(createDto.admissionDate),
        associationDate: new Date(createDto.associationDate),
        cardNumber: createDto.cardNumber || null,
        cardRetrieved: createDto.cardRetrieved ?? false,
        cardRetrievedAt,
        active: createDto.active ?? true,
      },
    });
  }

  async findAll(search?: string, active?: boolean, cardRetrieved?: boolean) {
    const where: any = {
      deletedAt: null,
    };

    if (search) {
      const cleanSearch = this.cleanCpf(search);
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cpf: { contains: cleanSearch || search } },
        { cardNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (typeof active === 'boolean') {
      where.active = active;
    }

    if (typeof cardRetrieved === 'boolean') {
      where.cardRetrieved = cardRetrieved;
    }

    return this.prisma.associate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
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

    if (updateDto.cpf) {
      data.cpf = this.cleanCpf(updateDto.cpf);
      const existingCpf = await this.prisma.associate.findFirst({
        where: { cpf: data.cpf, id: { not: id }, deletedAt: null },
      });
      if (existingCpf) {
        throw new BadRequestException('Outro associado já utiliza este CPF.');
      }
    }

    if (updateDto.email) {
      const existingEmail = await this.prisma.associate.findFirst({
        where: { email: updateDto.email, id: { not: id }, deletedAt: null },
      });
      if (existingEmail) {
        throw new BadRequestException('Outro associado já utiliza este e-mail.');
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
}
