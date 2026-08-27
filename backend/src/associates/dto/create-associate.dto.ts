import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAssociateDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'O CPF é obrigatório.' })
  @IsString()
  cpf: string;

  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'E-mail em formato inválido.' })
  email: string;

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
