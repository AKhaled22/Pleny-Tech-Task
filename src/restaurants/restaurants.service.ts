import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { FindNearbyRestaurantsDto } from './dto/find-nearby-restaurants.dto';
import { Restaurant } from './restaurant.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async findAll(where: any = {}): Promise<Restaurant[]> {
    try {
      return await this.restaurantModel.find(where).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to retrieve restaurants',
        error,
      );
    }
  }

  async findByIdOrSlug(identifier: string): Promise<Restaurant | null> {
    try {
      if (!identifier || identifier.trim() === '') {
        throw new BadRequestException('Restaurant identifier is required');
      }

      if (isValidObjectId(identifier)) {
        const restaurant = await this.restaurantModel
          .findById(identifier)
          .exec();
        if (restaurant) return restaurant;
      }

      const restaurant = await this.restaurantModel
        .findOne({ slug: identifier })
        .exec();
      if (!restaurant) {
        throw new NotFoundException(
          `Restaurant with identifier '${identifier}' not found`,
        );
      }

      return restaurant;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve restaurant');
    }
  }

  async findNearby(nearbyDto: FindNearbyRestaurantsDto): Promise<Restaurant[]> {
    try {
      const { longitude, latitude, radius = 1000 } = nearbyDto;

      return await this.restaurantModel
        .find({
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              $maxDistance: radius,
            },
          },
        })
        .exec();
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to find nearby restaurants',
      );
    }
  }
}
