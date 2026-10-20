import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const partnerRows = await this.prisma.$queryRaw<
      Array<{
        partner_benefit_id: string | null;
        benefit_name: string | null;
        discount_percentage: string | null;
        benefit_category: string | null;
        benefit_active: boolean | null;
        benefit_deleted_at: Date | null;
      }>
    >`
      SELECT
        u.partner_benefit_id,
        pb.name AS benefit_name,
        pb.discount_percentage,
        pb.category::text AS benefit_category,
        pb.active AS benefit_active,
        pb.deleted_at AS benefit_deleted_at
      FROM users u
      LEFT JOIN partner_benefits pb ON pb.id = u.partner_benefit_id
      WHERE u.id = ${user.id}
      LIMIT 1
    `;

    const partnerInfo = partnerRows[0];

    if (
      String(user.role) === 'PARTNER' &&
      partnerInfo?.partner_benefit_id &&
      (partnerInfo.benefit_active === false || partnerInfo.benefit_deleted_at !== null)
    ) {
      throw new UnauthorizedException('O convênio deste estabelecimento parceiro está inativo.');
    }

    return {
      access_token: `token-hrsj-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        hospital: 'Hospital Regional São Jerônimo',
        partnerBenefitId: partnerInfo?.partner_benefit_id || null,
        partnerName: partnerInfo?.benefit_name || null,
        discountPercentage: partnerInfo?.discount_percentage || null,
        partnerCategory: partnerInfo?.benefit_category || null,
      },
    };
  }
}

