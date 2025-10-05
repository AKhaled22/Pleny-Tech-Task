import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from 'src/restaurants/restaurant.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  @Prop({ required: true })
  fullName: string;

  @ApiPropertyOptional({
    description: 'List of favorite cuisines',
    example: ['Italian', 'Chinese', 'Mexican'],
    isArray: true,
  })
  @Prop()
  favoriteCuisines?: string[];

  @ApiProperty({
    description: 'List of restaurants the user is following',
    type: [Restaurant],
  })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
    default: [],
  })
  following: Restaurant[];
}

export const UserSchema = SchemaFactory.createForClass(User);
