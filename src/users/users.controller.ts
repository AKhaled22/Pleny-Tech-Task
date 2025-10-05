import { Body, Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { FavoritesResponse } from './dto/favorites-response.dto';
import { User } from './user.schema';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('favorites/:id')
  @ApiOperation({
    summary: 'Get user favorites',
    description:
      'Retrieve favorite restaurants and related users for a specific user',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Favorites retrieved successfully',
    type: FavoritesResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findFavorites(@Param('id') id: string): Promise<FavoritesResponse> {
    return this.usersService.findFavorites(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve all users in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }
}
