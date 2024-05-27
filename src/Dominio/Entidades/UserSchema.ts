import { Schema, model } from "mongoose";
import IUserModel from "../Interfaces/IUserModel";



const UserSchema = new Schema({
  FullName: {
    type: String,
    required: true,
  },
  Age: {
    type: String,
    default: 0,
  },
  RegisterDate: {
    type: Date,
    default: new Date(),

  },
  IP_Address: {
    type: String,
    required: true
  },
  Type: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true,
  }
});


UserSchema.pre('save', async function(next){
  if(!this.isModified){
    next();
  }
  // encriptar el password cada vez que se guarda
  // this.Password = Encrypt(this.Password);
})

const UserModel = model<IUserModel>('Users', UserSchema);
export default UserModel;