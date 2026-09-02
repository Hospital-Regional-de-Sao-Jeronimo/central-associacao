import { Controller, Get, Post, Body, Put, Param, Delete, Query, Patch } from '@nestjs/common';
import { AssociatesService } from './associates.service';
import { CreateAssociateDto } from './dto/create-associate.dto';
import { UpdateAssociateDto } from './dto/update-associate.dto';

@Controller('associates')
export class AssociatesController {
  constructor(private readonly associatesService: AssociatesService) {}

  @Post()
  create(@Body() createAssociateDto: CreateAssociateDto) {
    return this.associatesService.create(createAssociateDto);
  }

  @Post('import-ldap')
  importAllFromLdap() {
    return this.associatesService.importAllFromLdap();
  }

  @Get('departments')
  getDepartments() {
    return this.associatesService.getDepartments();
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('active') active?: string,
    @Query('cardRetrieved') cardRetrieved?: string,
    @Query('department') department?: string,
    @Query('birthDate') birthDate?: string,
    @Query('admissionDate') admissionDate?: string,
    @Query('letter') letter?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const activeBool = active !== undefined && active !== '' ? active === 'true' : undefined;
    const cardRetrievedBool = cardRetrieved !== undefined && cardRetrieved !== '' ? cardRetrieved === 'true' : undefined;
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    return this.associatesService.findAll(
      search,
      activeBool,
      cardRetrievedBool,
      department,
      birthDate,
      admissionDate,
      letter,
      pageNum,
      limitNum,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.associatesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAssociateDto: UpdateAssociateDto) {
    return this.associatesService.update(id, updateAssociateDto);
  }

  @Patch(':id/toggle-card')
  toggleCardRetrieved(
    @Param('id') id: string,
    @Body('cardRetrieved') cardRetrieved?: boolean,
  ) {
    return this.associatesService.toggleCardRetrieved(id, cardRetrieved);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.associatesService.remove(id);
  }
}
