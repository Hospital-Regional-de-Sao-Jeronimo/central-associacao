import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { RegisterLdapUserDto } from './dto/register-ldap-user.dto';
import { LdapService } from './ldap.service';

@Controller('ldap')
export class LdapController {
  constructor(private readonly ldapService: LdapService) {}

  @Get('search')
  search(@Query('query') query?: string) {
    return this.ldapService.searchLdap(query);
  }

  @Post('register')
  register(@Body() dto: RegisterLdapUserDto) {
    return this.ldapService.registerUser(dto);
  }

  @Get('users')
  findAllRegistered(@Query('search') search?: string) {
    return this.ldapService.findAllRegistered(search);
  }

  @Delete('users/:id')
  removeRegistered(@Param('id') id: string) {
    return this.ldapService.removeRegistered(id);
  }
}
