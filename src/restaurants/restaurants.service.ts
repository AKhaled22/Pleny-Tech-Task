import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './restaurant.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const createdRestaurant =
      await this.restaurantModel.create(createRestaurantDto);
    return createdRestaurant;
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.find().exec();
  }

  async findOne(id: string): Promise<Restaurant | null> {
    return this.restaurantModel.findOne({ _id: id }).exec();
  }

  async delete(id: string): Promise<Restaurant | null> {
    const deletedRestaurant = await this.restaurantModel
      .findByIdAndDelete({ _id: id })
      .exec();
    return deletedRestaurant;
  }
}
