import express, { Application } from "express";
import CorsConfiguration from "./cors.config";
import DependencyManager from "./container.config";
import { loadControllers } from "awilix-express";
import DatabaseManager from "./database.config";
import ErrorHandler from "./error.handler.config";
import IConfiguration, { Environment, EnvironmentStates, IConfigItem } from "../Interfaces/IConfigurations";
import IApiKeyManager from "../Interfaces/IApiKeyManager";
import { Server } from 'http';
import { logger } from "./logger.config";
import { AwilixContainer } from "awilix";
import { IDatabaseManager } from "../Interfaces/IDatabaseManager";
import ILoggerManager from "../../Utils/Loggs/ILoggerManager";
import ExceptionError from "../../Utils/ErrorManager/ExceptionError";
import { CodigoHTTP, MensajeHTTP } from "../../Utils/Enums/codigosHttp";

// interface ServerHandlerDeps {
//   config: IConfiguration;
// }

export default class ServerHandler {

  public app: Application;
  private config: IConfigItem;
  private apiKeyManager: IApiKeyManager;
  private server?: Server;
  private retryTimer: number = 5000;
  private errorHandler: ErrorHandler;
  private container: AwilixContainer<any>;
  private databaseManager: IDatabaseManager;
  private loggerManager: ILoggerManager;
  private env: Environment;

  constructor(env: Environment){
    this.app = express();
    this.env = env;
    this.container = DependencyManager(this.app, env); 
    this.config = this.container.resolve<IConfiguration>('configuration').settings;
    this.apiKeyManager = this.container.resolve<IApiKeyManager>('apiKeyManager');
    this.errorHandler = this.container.resolve<ErrorHandler>('errorHandler');
    this.databaseManager = this.container.resolve<IDatabaseManager>('databaseManager');
    this.loggerManager = this.container.resolve<ILoggerManager>('loggerManager');
      
    this.SetServerConfig();
    this.SetDataBaseConfig();
  }
  

  private SetServerConfig = () => {
    const json = express.json({limit:'10mb'});
    const cors = CorsConfiguration();

    this.app.use(json);
    this.app.use(cors);
    this.app.use(
      '/api/v1',  
      this.apiKeyManager.ValidateApiKey, 
      loadControllers('../Controllers/*.ts', { cwd: __dirname})
    );

    this.app.use(this.errorHandler.HandleException);
    
    // esta línea se utiliza para servir archivos estaticos 
    // this.app.use(express.static('public'))

  }

  private SetDataBaseConfig = () => {
    this.databaseManager.Connect(4000);
  }

  public Run = () =>{
    this.server = this.app.listen(this.config.PORT, ()=> {
      logger('info',`Server is running in PORT ${this.config.PORT} | ${this.env.toUpperCase()}`);
    });

    // Este evento se ejecuta si algún error no fue manejado por la app
    process.on('uncaughtException', (err: any)=> {
      logger('fatal', 'Ha ocurrido un error fatal en el servidor', err);
      this.loggerManager.ServerException(err.message);

      if(this.server){
        logger('warn', `El servidor procedera a cerrarse`);
        this.server.close(()=>{
          logger('warn', 'El servidor ha sido cerrado');
          setTimeout(()=>{
            logger('info', 'El servidor se esta reiniciando..');
            this.server = this.app.listen(this.config.PORT, ()=> {
              logger('info',`Server is running in PORT ${this.config.PORT}`);
            });
          }, this.retryTimer);
        })
      }
    });

    // Este evento se ejecuta si alguna promesa es rechazada y no fue manejada con un catch
    process.on('unhandledRejection', (reason:any, promise:any)=>{
      const data = { reason, promise };
      logger('fatal', 'Una promesa no fue manejada correctamente', data);
      this.loggerManager.ServerException(JSON.stringify(data))

    });

    process.on('worker', (worker)=> {
      logger('info', 'Se ha creado un Worker');
    });

  }
} 