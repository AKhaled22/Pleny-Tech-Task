import {
  IsString,
  IsOptional,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  readonly englishName: string;

  @IsOptional()
  @IsString()
  readonly arabicName?: string;

  @IsString()
  readonly slug: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  readonly cuisines: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  readonly coordinates: [number, number]; // [longitude, latitude]
}
