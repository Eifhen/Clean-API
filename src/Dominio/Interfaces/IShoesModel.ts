

import mongoose, { Document } from 'mongoose';
import IBrandModel from './IBrandModel';


export default interface IShoesModel extends Document {
  _id: mongoose.Types.ObjectId;
  Name: string;
  Size: number;
  Color: string;
  Stock: number;
  Brand: IBrandModel;
  Price: number;
}