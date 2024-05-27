import mongoose, { Schema, model } from "mongoose";
import ISalesModel from "../Interfaces/ISalesModel";


const SaleSchema = new Schema({
  Total: {
    type: Number,
    required: true,
  },
  Date: {
    type: Date,
    default: new Date(),
    required: true,
  },
  Client: {
    type: mongoose.Types.ObjectId,
    ref: 'Users',
  },
  Seller: {
    type: mongoose.Types.ObjectId,
    ref: 'Users'
  }
});

const SalesModel = model<ISalesModel>('Sales', SaleSchema);
export default SalesModel;