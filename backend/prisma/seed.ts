import 'dotenv/config';
import path from 'path';
import dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';

dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

import { PrismaClient, BenefitCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:2345/central_associacao?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Populando banco de dados com dados iniciais...');

  const associateCount = await prisma.associate.count();
  if (associateCount === 0) {
    console.log('Criando associados iniciais...');
    await prisma.associate.createMany({
      data: [
      {
        name: 'Ana Maria da Silva',
        cpf: '12345678901',
        email: 'ana.silva@hrsj.sc.gov.br',
        phone: '(48) 99887-1122',
        birthDate: new Date('1985-04-12'),
        address: 'Rua Adolfo Donato da Silva, 100, Kobrasol, São José - SC',
        admissionDate: new Date('2015-03-01'),
        associationDate: new Date('2015-04-15'),
        cardNumber: 'HRSJ-2015-001',
        cardRetrieved: true,
        cardRetrievedAt: new Date('2015-04-20'),
        active: true,
      },
      {
        name: 'Carlos Eduardo Oliveira',
        cpf: '98765432100',
        email: 'carlos.oliveira@hrsj.sc.gov.br',
        phone: '(48) 99112-3344',
        birthDate: new Date('1990-08-25'),
        address: 'Av. Presidente Kennedy, 500, Campinas, São José - SC',
        admissionDate: new Date('2020-01-10'),
        associationDate: new Date('2020-02-01'),
        cardNumber: 'HRSJ-2020-042',
        cardRetrieved: false,
        active: true,
      },
      {
        name: 'Juliana Barbosa Santos',
        cpf: '45678912304',
        email: 'juliana.santos@hrsj.sc.gov.br',
        phone: '(48) 98455-6677',
        birthDate: new Date('1978-11-03'),
        address: 'Rua Leoberto Leal, 250, Barreiros, São José - SC',
        admissionDate: new Date('2010-06-15'),
        associationDate: new Date('2010-07-01'),
        cardNumber: 'HRSJ-2010-008',
        cardRetrieved: true,
        cardRetrievedAt: new Date('2010-07-05'),
        active: true,
      },
    });
  }

  const benefitCount = await prisma.partnerBenefit.count();
  if (benefitCount === 0) {
    console.log('Criando benefícios de parceiros iniciais...');
    await prisma.partnerBenefit.createMany({
      data: [
        {
          name: 'Drogaria & Farmácia São José',
          category: BenefitCategory.SAUDE,
          discountPercentage: '20% OFF',
          description:
            'Desconto de 20% em medicamentos genéricos e 10% em perfumaria na apresentação da carteirinha da associação.',
          location: 'Rua Adolfo Donato da Silva, 45 - Praia Comprida, São José',
          phone: '(48) 3247-0000',
          website: 'https://farmaciasaojose.com.br',
          imageUrl:
            'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&auto=format&fit=crop&q=60',
          active: true,
        },
        {
          name: 'Restaurante Sabor & Saúde',
          category: BenefitCategory.ALIMENTACAO,
          discountPercentage: '15% OFF',
          description:
            'Desconto no buffet no almoço de segunda a sexta para funcionários associados do HRSJ.',
          location: 'Av. Leoberto Leal, 1200 - Barreiros, São José',
          phone: '(48) 3346-5544',
          website: 'https://instagram.com/restaurantesaboresaude',
          imageUrl:
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60',
          active: true,
        },
        {
          name: 'Academia FitLife São José',
          category: BenefitCategory.SAUDE,
          discountPercentage: '25% OFF',
          description:
            'Isenção de taxa de matrícula e 25% de desconto nas mensalidades do plano anual.',
          location: 'Rua Kobrasol, 300 - Kobrasol, São José',
          phone: '(48) 99654-3210',
          website: 'https://fitlife.com.br',
          imageUrl:
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60',
          active: true,
        },
        {
          name: 'Faculdade & Centro Universitário Unifa',
          category: BenefitCategory.EDUCACAO,
          discountPercentage: '30% OFF',
          description:
            'Bolsa de 30% de desconto para cursos de graduação e pós-graduação EAD e presenciais.',
          location: 'Rodovia BR-101, Km 205 - São José',
          phone: '(48) 0800-700-1000',
          website: 'https://unifa.edu.br',
          imageUrl:
            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=60',
          active: true,
        },
      ],
    });
  }

  // Seed Admin User
  const adminEmail: string = process.env.ADMIN_EMAIL || 'admin@hrsj.sc.gov.br';
  const adminPassword: string = process.env.ADMIN_PASSWORD || 'Central@HRSJ2026';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Clean up old demo admin if email changed
  await prisma.user.deleteMany({
    where: {
      email: {
        not: adminEmail,
      },
    },
  });

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      active: true,
    },
    create: {
      name: 'Administrador Central',
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
  });

  console.log(`✅ Banco de dados populado com sucesso! Admin: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
