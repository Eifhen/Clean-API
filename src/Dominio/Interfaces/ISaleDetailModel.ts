import ISalesModel from "./ISalesModel";
import IShoesModel from "./IShoesModel";
import mongoose, { Document } from 'mongoose';


export default interface ISalesDetailModel extends Document {
  _id: mongoose.Types.ObjectId;
  Sale: ISalesModel;
  Shoe: IShoesModel;
  Price: number;
}