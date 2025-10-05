import { Injectable } from '@nestjs/common';
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
    return this.restaurantModel.find(where).exec();
  }

  async findByIdOrSlug(identifier: string): Promise<Restaurant | null> {
    if (isValidObjectId(identifier)) {
      const restaurant = await this.restaurantModel.findById(identifier).exec();
      if (restaurant) return restaurant;
    }
    return this.restaurantModel.findOne({ slug: identifier }).exec();
  }

  async findNearby(nearbyDto: FindNearbyRestaurantsDto): Promise<Restaurant[]> {
    const { longitude, latitude, radius = 1000 } = nearbyDto;

    return this.restaurantModel
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
  }
}
