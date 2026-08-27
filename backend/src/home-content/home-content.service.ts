import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHomeContentDto } from './dto/update-home-content.dto';

const DEFAULT_HOME_CONTENT_ID = 'default-home-content';

@Injectable()
export class HomeContentService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomeContent() {
    let content = await this.prisma.homeContent.findUnique({
      where: { id: DEFAULT_HOME_CONTENT_ID },
    });

    if (!content) {
      content = await this.prisma.homeContent.create({
        data: {
          id: DEFAULT_HOME_CONTENT_ID,
        },
      });
    }

    // 1. Calculate automatic stats
    const currentYear = new Date().getFullYear();
    const parsedFoundationYear = parseInt(content.foundationYear, 10) || 1995;
    const computedYearsOfAction = `+${Math.max(0, currentYear - parsedFoundationYear)} Anos`;

    const totalAssociatesCount = await this.prisma.associate.count({
      where: { active: true, deletedAt: null },
    });
    const computedTotalAssociates = `+${totalAssociatesCount.toLocaleString('pt-BR')}`;

    const totalPartnersCount = await this.prisma.partnerBenefit.count({
      where: { active: true, deletedAt: null },
    });
    const computedTotalPartners = `+${totalPartnersCount} Conveniadas`;

    // 2. Resolve associate details for Board Members
    const rawBoardMembers = (content.boardMembers as any[]) || [];
    const associateIds = rawBoardMembers
      .map((m) => m.associateId)
      .filter((id): id is string => Boolean(id));

    let associatesMap = new Map<string, any>();
    if (associateIds.length > 0) {
      const associates = await this.prisma.associate.findMany({
        where: { id: { in: associateIds }, deletedAt: null },
      });
      associatesMap = new Map(associates.map((a) => [a.id, a]));
    }

    const enrichedBoardMembers = rawBoardMembers.map((m) => {
      if (m.associateId && associatesMap.has(m.associateId)) {
        const assoc = associatesMap.get(m.associateId);
        return {
          role: m.role,
          associateId: m.associateId,
          name: assoc.name,
          subtext: assoc.address || 'Servidor Associado HRSJ',
          associate: {
            id: assoc.id,
            name: assoc.name,
            cpf: assoc.cpf,
            email: assoc.email,
          },
        };
      }

      return {
        role: m.role,
        associateId: m.associateId || null,
        name: m.fallbackName || 'A Definir',
        subtext: m.fallbackSubtext || 'Diretoria HRSJ',
      };
    });

    return {
      ...content,
      yearsOfAction: computedYearsOfAction,
      totalAssociates: computedTotalAssociates,
      totalPartners: computedTotalPartners,
      boardMembers: enrichedBoardMembers,
    };
  }

  async updateHomeContent(updateDto: UpdateHomeContentDto) {
    // Ensure default content exists
    await this.prisma.homeContent.upsert({
      where: { id: DEFAULT_HOME_CONTENT_ID },
      create: { id: DEFAULT_HOME_CONTENT_ID },
      update: {},
    });

    await this.prisma.homeContent.update({
      where: { id: DEFAULT_HOME_CONTENT_ID },
      data: {
        ...(updateDto.heroBadge !== undefined && { heroBadge: updateDto.heroBadge }),
        ...(updateDto.heroTitle !== undefined && { heroTitle: updateDto.heroTitle }),
        ...(updateDto.heroSubtitle !== undefined && { heroSubtitle: updateDto.heroSubtitle }),
        ...(updateDto.foundationYear !== undefined && { foundationYear: updateDto.foundationYear }),
        ...(updateDto.foundationDate !== undefined && { foundationDate: updateDto.foundationDate }),
        ...(updateDto.historyBlocks !== undefined && { historyBlocks: updateDto.historyBlocks as any }),
        ...(updateDto.boardBadge !== undefined && { boardBadge: updateDto.boardBadge }),
        ...(updateDto.boardTitle !== undefined && { boardTitle: updateDto.boardTitle }),
        ...(updateDto.boardSubtitle !== undefined && { boardSubtitle: updateDto.boardSubtitle }),
        ...(updateDto.boardMembers !== undefined && { boardMembers: updateDto.boardMembers as any }),
      },
    });

    return this.getHomeContent();
  }
}
