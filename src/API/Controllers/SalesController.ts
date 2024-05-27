import { DELETE, GET, POST, PUT, before, route } from "awilix-express";
import ISalesService from "../../Aplicacion/Interfaces/ISalesService";
import Authenticate from "../Configuration/authentication.config";
import { NextFunction, Request, Response } from "express";
import { activityLog } from "../Configuration/logger.config";
import OperationArgs from "../../Utils/OperationArgs/OperationArgs";
import { CodigoHTTP } from "../../Utils/Enums/codigosHttp";



interface SalesControllerDependencys {
  salesService: ISalesService;
}

@before([Authenticate])
@route('/sales')
export default class SalesController {

  private readonly salesService:ISalesService;

  constructor(deps: SalesControllerDependencys){
    this.salesService = deps.salesService;

  }

  @route("/")
  @GET()
  public GetSales = async (req:Request, res:Response, next:NextFunction) => {
    try {
      activityLog('controller', 'SalesController', 'GetSales', req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.salesService.GetAll(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      next(err);
    }
  }

  @route("/query/")
  @GET()
  public GetByQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog("controller", "SalesController", "GetByQuery", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.salesService.GetByQuery(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      next(err);
    }
  }

  @route("/:id")
  @GET()
  public GetByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog("controller", "SalesController", "GetByID", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.salesService.GetByID(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      next(err);
    }
  }

  @route("/")
  @POST()
  public Add = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog('controller','SalesController', 'Add', req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.salesService.AddSales(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err){
      next(err);
    }
  }

  @route("/")
  @PUT()
  public Edit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog('controller','SalesController', 'Edit', req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.salesService.EditSales(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err){
      next(err);
    }
  }

  @route("/:id")
  @DELETE()
  public Delete = async (req:Request, res:Response, next: NextFunction) => {
    try {
      activityLog("controller", "SalesController", "Delete", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.salesService.DeleteSales(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      next(err);
    }
  }



}