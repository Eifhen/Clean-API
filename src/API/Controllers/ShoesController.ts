import { DELETE, GET, POST, PUT, before, route } from "awilix-express";
import IShoesService from "../../Aplicacion/Interfaces/IShoesService";
import Authenticate from "../Configuration/authentication.config";
import { activityLog } from "../Configuration/logger.config";
import OperationArgs from "../../Utils/OperationArgs/OperationArgs";
import { CodigoHTTP } from "../../Utils/Enums/codigosHttp";
import { NextFunction, Request, Response } from "express";


interface ShoesControllerDependencys {
  shoesService: IShoesService;
}


@before(Authenticate)
@route("/shoes")
export default class ShoesController {

  private readonly shoesService: IShoesService;

  constructor(deps: ShoesControllerDependencys){
    this.shoesService = deps.shoesService;
  }

  @route("/")
  @GET()
  public GetSales = async (req:Request, res:Response, next:NextFunction) => {
    try {
      activityLog('controller', 'ShoesController', 'GetSales', req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.shoesService.GetAll(args);
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
      activityLog("controller", "ShoesController", "GetByQuery", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.shoesService.GetByQuery(args);
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
      activityLog("controller", "ShoesController", "GetByID", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.shoesService.GetByID(args);
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
      activityLog('controller','ShoesController', 'Add', req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.shoesService.AddShoes(args);
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
      activityLog('controller','ShoesController', 'Edit', req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.shoesService.EditShoes(args);
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
      activityLog("controller", "ShoesController", "Delete", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.shoesService.DeleteShoes(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      next(err);
    }
  }



}