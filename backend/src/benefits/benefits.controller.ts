import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { BenefitCategory } from '@prisma/client';
import { BenefitsService } from './benefits.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Post()
  create(@Body() createBenefitDto: CreateBenefitDto) {
    return this.benefitsService.create(createBenefitDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: BenefitCategory,
    @Query('active') active?: string,
  ) {
    const activeBool = active !== undefined ? active === 'true' : undefined;
    return this.benefitsService.findAll(search, category, activeBool);
  }

  @Get('categories')
  getCategories() {
    return this.benefitsService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.benefitsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBenefitDto: UpdateBenefitDto) {
    return this.benefitsService.update(id, updateBenefitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.benefitsService.remove(id);
  }
}
