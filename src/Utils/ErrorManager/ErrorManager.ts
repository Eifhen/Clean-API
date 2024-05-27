import { CodigoHTTP, MensajeHTTP } from "../Enums/codigosHttp";
import IErrorManager from "./IErrorManager";
import ILoggerManager from "../Loggs/ILoggerManager";
import ExceptionError, { IExceptionError } from "./ExceptionError";


interface ErrorManagerDependencys {
  loggerManager: ILoggerManager;
}

export default class ErrorManager implements IErrorManager {
  
  private logger:ILoggerManager;

  constructor(deps:ErrorManagerDependencys){
    this.logger = deps.loggerManager;
  }

  public getException = (error: ExceptionError, withStack = true): ExceptionError => {
    this.logger.LogException(error);
    return {
      ...error,
      message: error.message,
      stack: withStack ? error.stack : '',
      path: withStack ? error.path : ''
    };
  }
}