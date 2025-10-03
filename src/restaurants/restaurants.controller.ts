import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
  Req,
  Query,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { FindNearbyRestaurantsDto } from './dto/find-nearby-restaurants.dto';
import { Restaurant } from './restaurant.schema';
import { FilterInterceptor } from '../interceptors/filter.interceptor';
import type { Request } from 'express';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantsService.create(createRestaurantDto);
  }

  @Get()
  @UseInterceptors(new FilterInterceptor<'Restaurant'>(['cuisines']))
  async findAll(
    @Req() request: Request & { where?: unknown },
  ): Promise<Restaurant[]> {
    const where = request.where || {};
    return this.restaurantsService.findAll(where);
  }

  @Get('nearby')
  async findNearby(
    @Query() nearbyDto: FindNearbyRestaurantsDto,
  ): Promise<Restaurant[]> {
    return this.restaurantsService.findNearby(nearbyDto);
  }

  @Get(':identifier')
  async findByIdOrSlug(
    @Param('identifier') identifier: string,
  ): Promise<Restaurant | null> {
    return this.restaurantsService.findByIdOrSlug(identifier);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.restaurantsService.delete(id);
  }
}
