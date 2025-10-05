import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/user.schema';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema()
export class Restaurant {
  @ApiProperty({
    description: 'Restaurant name in English',
    example: 'Pizza Palace',
  })
  @Prop({ required: true })
  englishName: string;

  @ApiPropertyOptional({
    description: 'Restaurant name in Arabic',
    example: 'قصر البيتزا',
  })
  @Prop()
  arabicName?: string;

  @ApiProperty({
    description: 'Unique slug identifier for the restaurant',
    example: 'pizza-palace',
  })
  @Prop({ required: true, unique: true })
  slug: string;

  @ApiProperty({
    description: 'List of cuisines (1-3 items)',
    example: ['Italian', 'Pizza'],
    isArray: true,
    minItems: 1,
    maxItems: 3,
  })
  @Prop({
    type: [String],
    validate: [
      (val: string[]) => val.length >= 1 && val.length <= 3,
      'Cuisines must be between 1 and 3',
    ],
  })
  cuisines: string[];

  @ApiProperty({
    description: 'List of users who follow this restaurant',
    type: [User],
  })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  followers: User[];

  @ApiProperty({
    description: 'GeoJSON Point location of the restaurant',
    example: {
      type: 'Point',
      coordinates: [-74.006, 40.7128],
    },
  })
  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.index({ location: '2dsphere' });
