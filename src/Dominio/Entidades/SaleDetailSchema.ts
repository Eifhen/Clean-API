import mongoose, { Schema, model } from "mongoose";
import ISalesDetailModel from "../Interfaces/ISaleDetailModel";


const SaleDetailSchema = new Schema({
  Sale: {
    type: mongoose.Types.ObjectId,
    ref: "Sales",
  },
  Shoe: {
    type: mongoose.Types.ObjectId,
    ref: 'Shoes',
  },
  Price: {
    type: Number,
    require: true
  }
});

const SalesDetailModel = model<ISalesDetailModel>('SaleDetail', SaleDetailSchema);
export default SalesDetailModel;