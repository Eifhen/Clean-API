import mongoose from 'mongoose';
import { logger } from './logger.config';
import IConfiguration from '../Interfaces/IConfigurations';
import { IDatabaseManager } from '../Interfaces/IDatabaseManager';



interface DatabaseManagerDependencys {
  configuration: IConfiguration;
}

export default class DatabaseManager implements IDatabaseManager {
  
  private _configuration:IConfiguration;

  constructor(deps: DatabaseManagerDependencys){
    this._configuration = deps.configuration;
  }

  Connect = async (retryInterval:number = 5000) => {
    const { CONNECTION_STRING } = this._configuration.settings;
    let retryTimer:any = null;
  
    const retryConnection = async () => {
      try {
        await mongoose.connect(CONNECTION_STRING);
        logger("info","Database connected");
      }
      catch(err:any){
        // si falla la connección intentalo de nuevo en x milisegundos
        logger("fatal", 'Error al conectarse a la base de datos',err);
        retryTimer = setTimeout(()=>{
          logger("info","reTrying connection...");
          this.Connect(retryInterval);
        }, retryInterval);
      }
    }
  
    await retryConnection();
  
    // Limpiar el temporizador cuando la conexión sea exitosa
    if(retryTimer){
      clearInterval(retryTimer);
    }
  }

}
