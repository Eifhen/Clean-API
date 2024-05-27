
import mongoose, { Document } from 'mongoose';



export default interface IBrandModel extends Document {
  _id: mongoose.Types.ObjectId;
  Name: string;
  Country: string;
}