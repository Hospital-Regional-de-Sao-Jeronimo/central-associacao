import { Injectable, NotFoundException } from '@nestjs/common';
import { BenefitCategory } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

@Injectable()
export class BenefitsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateBenefitDto) {
    return this.prisma.partnerBenefit.create({
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

    return this.prisma.partnerBenefit.findMany({
      where,
      orderBy: { name: 'asc' },
    });
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

    return benefit;
  }

  async update(id: string, updateDto: UpdateBenefitDto) {
    await this.findOne(id);

    return this.prisma.partnerBenefit.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.partnerBenefit.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        active: false,
      },
    });
  }
}
