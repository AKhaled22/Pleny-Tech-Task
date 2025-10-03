import {
  IsString,
  IsOptional,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  readonly englishName: string;

  @IsOptional()
  @IsString()
  readonly arabicName?: string;

  @IsString()
  readonly uniqueName: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  readonly cuisines: string[];
}
