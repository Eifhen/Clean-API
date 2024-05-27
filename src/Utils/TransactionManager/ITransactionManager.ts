import mongoose from "mongoose";



export default interface ITransactionManager {
  StartSession() : Promise<mongoose.mongo.ClientSession>
  Commit() : Promise<void>;
  RollBack() : Promise<void>;

}