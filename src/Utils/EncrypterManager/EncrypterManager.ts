import { CodigoHTTP } from "../Enums/codigosHttp";
import ExceptionError from "../ErrorManager/ExceptionError";
import IEncrypterManager from "./IEncrypterManager";
import bcrypt from 'bcrypt';





export default class EncrypterManager implements IEncrypterManager {
  
  private readonly saltRounds:number = 10;

  constructor(){

  }

  Encrypt = async (item:string) : Promise<string> => {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      const result = await bcrypt.hash(item, salt);
      return result;
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      );
    }
  }

  ComparePassword = async (plainTextPassword: string, hashedPassword: string) : Promise<boolean> => {
    try {
      return await bcrypt.compare(plainTextPassword, hashedPassword);
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      );
    }
  }


}