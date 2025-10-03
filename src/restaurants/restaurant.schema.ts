import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/user.schema';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema()
export class Restaurant {
  @Prop({ required: true })
  englishName: string;

  @Prop()
  arabicName: string;

  @Prop({ required: true, unique: true })
  uniqueName: string;

  @Prop({
    type: [String],
    validate: [
      (val: string[]) => val.length >= 1 && val.length <= 3,
      'Cuisines must be between 1 and 3',
    ],
  })
  cuisines: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  followers: User[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
