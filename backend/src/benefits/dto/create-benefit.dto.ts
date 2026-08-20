import { IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { BenefitCategory } from '@prisma/client';

export class CreateBenefitDto {
  @IsNotEmpty({ message: 'O nome do estabelecimento é obrigatório.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'A categoria é obrigatória.' })
  @IsEnum(BenefitCategory, { message: 'Categoria inválida.' })
  category: BenefitCategory;

  @IsNotEmpty({ message: 'O percentual ou descrição do desconto é obrigatório.' })
  @IsString()
  discountPercentage: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'A localização ou endereço é obrigatório.' })
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
