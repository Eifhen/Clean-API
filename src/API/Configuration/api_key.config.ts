import { NextFunction, Request, Response } from 'express';
import IConfiguration, { IConfigItem } from '../Interfaces/IConfigurations';
import IApiKeyManager from '../Interfaces/IApiKeyManager';
import { v4 as uuidv4 } from 'uuid';
import { CodigoHTTP } from '../../Utils/Enums/codigosHttp';
import ExceptionError from '../../Utils/ErrorManager/ExceptionError';
import { activityLog } from './logger.config';

interface ApiKeyManagerDependencys {
  configuration: IConfiguration;
}

export default class ApiKeyManager implements IApiKeyManager {
  config: IConfigItem;

  constructor(deps: ApiKeyManagerDependencys) {
    this.config = deps.configuration.settings;
  }

  public ValidateApiKey = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
      const incomingApiKey = req.headers[this.config.API_KEY_HEADER];
      if(incomingApiKey === this.config.APIKEY){
        // agregar request id
        const id = uuidv4().slice(0, 8);
        req.requestID = id;
        activityLog("middleware", "ApiKeyManager", "ValidateApiKey", id);
        next();
      }
      else {
        throw new ExceptionError(
          CodigoHTTP.InternalServerError,
          'Error al validar el api key',
          __filename,
        )
      }
    }
    catch(err:any){
      next(err);
    }
  }
}