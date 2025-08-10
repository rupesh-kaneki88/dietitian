
import mongoose, { Document, Schema } from 'mongoose';

export interface IDish extends Document {
  name: string;
  recipe: string;
  // Add any other dish-related fields here
}

const DishSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  recipe: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Dish || mongoose.model<IDish>('Dish', DishSchema);
