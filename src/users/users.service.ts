import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FavoritesResponse } from './dto/favorites-response.dto';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async findFavorites(userId: string): Promise<FavoritesResponse> {
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
      throw new Error('User not found or no favorites available');
    }

    return result[0];
  }
}
