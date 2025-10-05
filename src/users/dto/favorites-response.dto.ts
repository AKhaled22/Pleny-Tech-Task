import { Restaurant } from '../../restaurants/restaurant.schema';
import { User } from '../user.schema';

export interface FavoritesResponse {
  users: User[];
  restaurants: Restaurant[];
}
