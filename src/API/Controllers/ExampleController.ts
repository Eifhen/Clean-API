
import { route, GET, POST, before } from 'awilix-express' 
import { Request, Response } from 'express';
import IBrandRepository from '../../Infraestructura/Interfaces/IBrandRepository';
import { CodigoHTTP } from '../../Utils/Enums/codigosHttp';
import ExceptionError from '../../Utils/ErrorManager/ExceptionError';
import getRequestID from '../../Utils/Helpers/getRequestID';
import IErrorManager from '../../Utils/ErrorManager/IErrorManager';
import { activityLog } from '../Configuration/logger.config';
import Authenticate from '../Configuration/authentication.config';

interface ExampleControllerDependecies {
  brandRepository: IBrandRepository;
  errorManager: IErrorManager;
}

@route("/example")
@before(Authenticate)
export default class ExampleControllerAPI {

  private _brandRepository:IBrandRepository;
  private errorManager: IErrorManager;

  constructor(deps: ExampleControllerDependecies){
    this._brandRepository = deps.brandRepository;
    this.errorManager = deps.errorManager;
  }


  @route("/getAll")
  @GET()
  async GetAllBrands(req: Request, res: Response){
    activityLog("controller", "ExampleControllerAPI", "GetAllBrands", req.requestID);
    const data = await this._brandRepository.getAll();
    return res.status(200).send(data);
  }

  @route('/error')
  @GET()
  async TestError(req:Request, res: Response){
    activityLog('controller', 'ExampleControllerAPI', 'TestError', req.requestID);
    throw this.errorManager.getException(new ExceptionError(
      CodigoHTTP.NotFound, 
      'Error de prueba',
       __filename, 
       req.requestID
    ));
  }

  @route('/error/promise')
  @GET()
  async PromiseError(req:Request, res: Response) {
    activityLog('controller', 'ExampleControllerAPI', 'PromiseError', req.requestID);
    throw Promise.reject(new Error('Error promesa rechazada'));

  }


}