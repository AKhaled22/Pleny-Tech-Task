import { Body, Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { FavoritesResponse } from './dto/favorites-response.dto';
import { User } from './user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('favorites/:id')
  async findFavorites(@Param('id') id: string): Promise<FavoritesResponse> {
    return this.usersService.findFavorites(id);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }
}
