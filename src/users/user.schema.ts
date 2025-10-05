import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Restaurant } from 'src/restaurants/restaurant.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop()
  favoriteCuisines: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
    default: [],
  })
  following: Restaurant[];
}

export const UserSchema = SchemaFactory.createForClass(User);
