import { Module } from '@nestjs/common';
import { AssociatesService } from './associates.service';
import { AssociatesController } from './associates.controller';
import { LdapModule } from '../ldap/ldap.module';

@Module({
  imports: [LdapModule],
  controllers: [AssociatesController],
  providers: [AssociatesService],
  exports: [AssociatesService],
})
export class AssociatesModule {}
