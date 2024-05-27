import { NextFunction, Request, Response } from "express";
import IConfiguration, { EnvironmentStates } from "../Interfaces/IConfigurations";
import ExceptionError from "../../Utils/ErrorManager/ExceptionError";
import { logger } from "./logger.config";
import { CodigoHTTP, MensajeHTTP } from "../../Utils/Enums/codigosHttp";
import IErrorManager from "../../Utils/ErrorManager/IErrorManager";


interface ErrorHandlerDependencys {
  errorManager: IErrorManager;
  configuration: IConfiguration;
}

export default class ErrorHandler {
  
  private errorManager:IErrorManager;
  private configuration: IConfiguration;
  private isDevelopment: boolean;

  constructor(deps: ErrorHandlerDependencys){
    this.errorManager = deps.errorManager;
    this.configuration = deps.configuration;
    this.isDevelopment = deps.configuration.settings.environment === EnvironmentStates.DEVELOPMENT;
  }

  HandleException = async (error:ExceptionError, req: Request, res: Response, next: NextFunction) => {
    logger('error', `Error Handler Middleware =>`, error);
    
    error.status = error.status ?? CodigoHTTP.InternalServerError;
    error.requestID = req.requestID;
    error.name = error.name ?? 'ServerError';
    error.path = error.path ?? '';
    error.date = error.date ?? new Date();
    error.message = error.message ?? MensajeHTTP.InternalServerError;

    return res.status(error.status).send(this.errorManager.getException(
      error, 
      this.isDevelopment
    ));
  }

}


