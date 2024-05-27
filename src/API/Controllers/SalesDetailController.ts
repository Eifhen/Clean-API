import { DELETE, GET, POST, PUT, before, route } from "awilix-express";
import ISalesDetailService from "../../Aplicacion/Interfaces/ISalesDetailService";
import Authenticate from "../Configuration/authentication.config";
import { activityLog } from "../Configuration/logger.config";
import OperationArgs from "../../Utils/OperationArgs/OperationArgs";
import { NextFunction, Request, Response } from "express";
import { CodigoHTTP } from "../../Utils/Enums/codigosHttp";




interface SalesDetailControllerDependencys {
  salesDetailService: ISalesDetailService
}


@before(Authenticate)
@route('/sales-detail')
export default class SalesDetailController {

  private readonly salesDetailService: ISalesDetailService;

  constructor(deps:SalesDetailControllerDependencys){
    this.salesDetailService = deps.salesDetailService;
  }

  @route("/")
  @GET()
  public GetSales = async (req:Request, res:Response, next:NextFunction) => {
    try {
      activityLog('controller', 'SalesDetailController', 'GetSales', req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.salesDetailService.GetAll(args);
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
      activityLog("controller", "SalesDetailController", "GetByQuery", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.salesDetailService.GetByQuery(args);
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
      activityLog("controller", "SalesDetailController", "GetByID", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.salesDetailService.GetByID(args);
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
      activityLog('controller','SalesDetailController', 'Add', req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.salesDetailService.AddSales(args);
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
      activityLog('controller','SalesDetailController', 'Edit', req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.salesDetailService.EditSales(args);
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
      activityLog("controller", "SalesDetailController", "Delete", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.salesDetailService.DeleteSales(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      next(err);
    }
  }

}