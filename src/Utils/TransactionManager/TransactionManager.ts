import mongoose from "mongoose";
import ITransactionManager from './ITransactionManager';



export default class TransactionManager implements ITransactionManager{
  private session: mongoose.mongo.ClientSession | null = null;

  constructor(){
    //this.StartSession();
  }

  public StartSession = async () : Promise<mongoose.mongo.ClientSession> => {
    this.session = await mongoose.startSession();
    this.session.startTransaction();
    return this.session;
  }

  public Commit = async () => {
    if(this.session){
      await this.session.commitTransaction(); // Confirma la transacción
      this.session.endSession(); // Finaliza la sesión
    }
  }

  public RollBack = async () => {
    if(this.session){
      await this.session.abortTransaction(); // Revierte la transacción si hay algún error
      await this.session.endSession(); // Finaliza la sesión
    }
  }

}