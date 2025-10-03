import { IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly fullName: string;

  @IsString({ each: true })
  @IsOptional()
  readonly favoriteCuisines?: string[];
}
