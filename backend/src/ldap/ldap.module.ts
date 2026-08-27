import { Module } from '@nestjs/common';
import { LdapController } from './ldap.controller';
import { LdapService } from './ldap.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LdapController],
  providers: [LdapService],
  exports: [LdapService],
})
export class LdapModule {}
