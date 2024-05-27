import mongoose, { Schema, model } from "mongoose";
import IBrandModel from "../Interfaces/IBrandModel";

const BrandSchema = new Schema({
  Name : {
    type: String,
    required: true
  },
  Country: {
    type: String,
    required: true
  }
});


const BrandModel = model<IBrandModel>('Brand', BrandSchema);
export default BrandModel;