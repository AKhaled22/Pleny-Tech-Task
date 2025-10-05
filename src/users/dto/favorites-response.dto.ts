import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../../restaurants/restaurant.schema';
import { User } from '../user.schema';

export class FavoritesResponse {
  @ApiProperty({
    description: 'List of users who have favorited restaurants',
    type: [User],
  })
  users: User[];

  @ApiProperty({
    description: 'List of favorite restaurants',
    type: [Restaurant],
  })
  restaurants: Restaurant[];
}
