import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    let connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      const user = process.env.POSTGRES_USER || 'postgres';
      const pass = process.env.POSTGRES_PASSWORD || 'postgres';
      const host = process.env.POSTGRES_HOST || 'postgres';
      const db = process.env.POSTGRES_DB || 'central_associacao';
      connectionString = `postgresql://${user}:${pass}@${host}:5432/${db}`;
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    await this.ensurePartnerSchema();
  }

  private async ensurePartnerSchema() {
    try {
      await this.$executeRawUnsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_enum
            WHERE enumlabel = 'PARTNER'
              AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'Role')
          ) THEN
            ALTER TYPE "Role" ADD VALUE 'PARTNER';
          END IF;
        END$$;
      `);

      await this.$executeRawUnsafe(`
        ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "partner_benefit_id" TEXT UNIQUE
        REFERENCES "partner_benefits"("id") ON DELETE SET NULL;
      `);

      await this.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "discount_usages" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "associate_id" TEXT NOT NULL REFERENCES "associates"("id") ON DELETE CASCADE,
          "partner_benefit_id" TEXT NOT NULL REFERENCES "partner_benefits"("id") ON DELETE CASCADE,
          "discount_applied" TEXT NOT NULL,
          "notes" TEXT,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (err) {
      console.warn('Aviso ao verificar schema de parceiros:', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

