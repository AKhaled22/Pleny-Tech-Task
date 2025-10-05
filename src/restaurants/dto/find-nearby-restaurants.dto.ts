import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class FindNearbyRestaurantsDto {
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  radius?: number = 1000;
}
