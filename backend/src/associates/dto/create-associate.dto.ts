import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAssociateDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida.' })
  birthDate?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de admissão inválida.' })
  admissionDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Data de associação inválida.' })
  associationDate?: string;

  @IsOptional()
  @IsString()
  cardNumber?: string;

  @IsOptional()
  @IsBoolean()
  cardRetrieved?: boolean;

  @IsOptional()
  @IsDateString()
  cardRetrievedAt?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
