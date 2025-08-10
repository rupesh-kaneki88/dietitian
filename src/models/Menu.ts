
import mongoose, { Document, Schema } from 'mongoose';
import { IClient } from './Client';
import { IDish } from './Dish';

export interface IMenu extends Document {
  client: IClient['_id'];
  dishes: IDish['_id'][];
  // Add any other menu-related fields here
}

const MenuSchema: Schema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  dishes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Dish',
    },
  ],
});

export default mongoose.models.Menu || mongoose.model<IMenu>('Menu', MenuSchema);
