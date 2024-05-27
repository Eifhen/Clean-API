

import mongoose, { Document } from 'mongoose';
import IUserModel from './IUserModel';


export default interface ISalesModel extends Document {
  _id: mongoose.Types.ObjectId;
  Total: number;
  Date: Date;
  Client: IUserModel;
  Seller: IUserModel;
}