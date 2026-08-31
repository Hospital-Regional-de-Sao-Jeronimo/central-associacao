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
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
