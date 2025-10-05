import {
  Body,
  Controller,
  Get,
  Param,
  UseInterceptors,
  Req,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { FindNearbyRestaurantsDto } from './dto/find-nearby-restaurants.dto';
import { Restaurant } from './restaurant.schema';
import { FilterInterceptor } from '../interceptors/filter.interceptor';
import { ErrorResponse } from '../common/dto/error-response.dto';
import type { Request } from 'express';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all restaurants',
    description: 'Retrieve all restaurants with optional filtering by cuisine',
  })
  @ApiQuery({
    name: 'filters[cuisines]',
    required: false,
    description: 'Filter by cuisine types (single value)',
    example: 'Italian',
  })
  @ApiResponse({
    status: 200,
    description: 'List of restaurants retrieved successfully',
    type: [Restaurant],
  })
  @UseInterceptors(new FilterInterceptor<'Restaurant'>(['cuisines']))
  async findAll(
    @Req() request: Request & { where?: unknown },
  ): Promise<Restaurant[]> {
    const where = request.where || {};
    return this.restaurantsService.findAll(where);
  }

  @Get('nearby')
  @ApiOperation({
    summary: 'Find nearby restaurants',
    description:
      'Find restaurants within a specified radius of given coordinates',
  })
  @ApiResponse({
    status: 200,
    description: 'Nearby restaurants found successfully',
    type: [Restaurant],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid coordinates or radius provided',
    type: ErrorResponse,
  })
  async findNearby(
    @Query() nearbyDto: FindNearbyRestaurantsDto,
  ): Promise<Restaurant[]> {
    return this.restaurantsService.findNearby(nearbyDto);
  }

  @Get(':identifier')
  @ApiOperation({
    summary: 'Get restaurant by ID or slug',
    description: 'Retrieve a specific restaurant by its MongoDB ID or slug',
  })
  @ApiParam({
    name: 'identifier',
    description: 'Restaurant ID or slug',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant found successfully',
    type: Restaurant,
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant not found',
  })
  async findByIdOrSlug(
    @Param('identifier') identifier: string,
  ): Promise<Restaurant | null> {
    return this.restaurantsService.findByIdOrSlug(identifier);
  }
}
