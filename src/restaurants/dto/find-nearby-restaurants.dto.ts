import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FindNearbyRestaurantsDto {
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(10000) // Max 10km radius
  radius?: number = 1000; // Default 1km in meters
}
