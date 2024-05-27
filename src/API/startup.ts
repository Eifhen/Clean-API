
import { AwilixContainer } from "awilix";
import ServerHandler from "./Configuration/server.config";
import { Environment } from './Interfaces/IConfigurations';
import IUserModel from "../Dominio/Interfaces/IUserModel";

declare global {
  namespace Express {
    interface Request {
      container: AwilixContainer;
      currentUser?: IUserModel;
      requestID: string;
    }
  }
}

(async function StartApp(){
  const environment = process.argv[2] as Environment;
  new ServerHandler(environment).Run();  
})();

