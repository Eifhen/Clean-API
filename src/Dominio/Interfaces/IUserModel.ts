

import mongoose, { Document } from 'mongoose';


export type UserType = 'Seller' | 'Client';

export default interface IUserModel extends Document {
  _id: mongoose.Types.ObjectId;
  FullName:string;
  Age:number;
  RegisterDate: Date;
  IP_Address: string;
  Type: UserType;
  Email: string;
  Password: string;
}