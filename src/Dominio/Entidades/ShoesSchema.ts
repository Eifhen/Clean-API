import mongoose, { Schema, model } from "mongoose";
import IShoesModel from "../Interfaces/IShoesModel";


const ShoesSchema = new Schema({
  Name: {
    type: String,
    required: true
  },
  Size: {
    type: Number,
    required: true
  },
  Color: {
    type: String,
    required: true,
  },
  Stock: {
    type: Number,
    required: true,
  },
  Brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  Price: {
    type: Number,
    required: true
  }
});


const ShoesModel = model<IShoesModel>('Shoes', ShoesSchema);
export default ShoesModel;