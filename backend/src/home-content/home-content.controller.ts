import { Controller, Get, Put, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { HomeContentService } from './home-content.service';
import { UpdateHomeContentDto } from './dto/update-home-content.dto';

@Controller('home-content')
export class HomeContentController {
  constructor(private readonly homeContentService: HomeContentService) {}

  @Get()
  getHomeContent() {
    return this.homeContentService.getHomeContent();
  }

  @Put()
  updateHomeContent(
    @Body() updateDto: UpdateHomeContentDto,
    @Headers('authorization') authHeader?: string,
  ) {
    if (!authHeader) {
      throw new UnauthorizedException('Apenas usuários administradores autenticados podem editar o conteúdo da página.');
    }

    return this.homeContentService.updateHomeContent(updateDto);
  }
}
