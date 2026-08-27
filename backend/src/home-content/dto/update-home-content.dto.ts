import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BoardMemberDto {
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  associateId?: string;

  @IsOptional()
  @IsString()
  fallbackName?: string;

  @IsOptional()
  @IsString()
  fallbackSubtext?: string;
}

export class HistoryBlockDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  content1: string;

  @IsOptional()
  @IsString()
  content2?: string;
}

export class UpdateHomeContentDto {
  @IsOptional()
  @IsString()
  heroBadge?: string;

  @IsOptional()
  @IsString()
  heroTitle?: string;

  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @IsOptional()
  @IsString()
  foundationYear?: string;

  @IsOptional()
  @IsString()
  foundationDate?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HistoryBlockDto)
  historyBlocks?: HistoryBlockDto[];

  @IsOptional()
  @IsString()
  boardBadge?: string;

  @IsOptional()
  @IsString()
  boardTitle?: string;

  @IsOptional()
  @IsString()
  boardSubtitle?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoardMemberDto)
  boardMembers?: BoardMemberDto[];
}
