import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { FavoritesResponse } from './dto/favorites-response.dto';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users', error);
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      if (!isValidObjectId(id)) {
        throw new BadRequestException('Invalid user ID format');
      }

      const user = await this.userModel.findOne({ _id: id }).exec();

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async findFavorites(userId: string): Promise<FavoritesResponse> {
    try {
      if (!isValidObjectId(userId)) {
        throw new BadRequestException('Invalid user ID format');
      }

      const userObjectId = new Types.ObjectId(userId);
      const pipeline = [
        {
          $match: {
            _id: userObjectId,
          },
        },
        {
          $project: {
            favoriteCuisines: 1,
          },
        },
        {
          $lookup: {
            from: 'users',
            let: { userCuisines: '$favoriteCuisines' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $ne: ['$_id', userObjectId] },
                      {
                        $gt: [
                          {
                            $size: {
                              $setIntersection: [
                                '$favoriteCuisines',
                                '$$userCuisines',
                              ],
                            },
                          },
                          0,
                        ],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 1,
                  fullName: 1,
                  favoriteCuisines: 1,
                  following: 1,
                },
              },
            ],
            as: 'similarUsers',
          },
        },
        {
          $lookup: {
            from: 'restaurants',
            let: {
              allFollowedRestaurants: {
                $reduce: {
                  input: '$similarUsers.following',
                  initialValue: [],
                  in: {
                    $setUnion: ['$$value', '$$this'],
                  },
                },
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: { $in: ['$_id', '$$allFollowedRestaurants'] },
                },
              },
            ],
            as: 'favoriteRestaurants',
          },
        },
        {
          $project: {
            users: '$similarUsers',
            restaurants: '$favoriteRestaurants',
          },
        },
      ];
      const result: FavoritesResponse[] = (await this.userModel
        .aggregate(pipeline)
        .exec()) as FavoritesResponse[];

      if (!result || result.length === 0) {
        throw new NotFoundException(
          `User with ID ${userId} not found or no favorites available`,
        );
      }

      return result[0];
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve user favorites',
      );
    }
  }
}
