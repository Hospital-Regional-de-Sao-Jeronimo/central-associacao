import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AssociatesModule } from './associates/associates.module';
import { BenefitsModule } from './benefits/benefits.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, AssociatesModule, BenefitsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


