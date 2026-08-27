import { IsNotEmpty, IsString } from 'class-validator';

export class SearchLdapDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
