import { DELETE, GET, POST, PUT, before, route } from "awilix-express";
import Authenticate from "../Configuration/authentication.config";
import { NextFunction, Response, Request } from "express";
import { activityLog } from "../Configuration/logger.config";
import OperationArgs from "../../Utils/OperationArgs/OperationArgs";
import IBrandService from "../../Aplicacion/Interfaces/IBrandService";
import { CodigoHTTP } from "../../Utils/Enums/codigosHttp";

interface BrandControllerDependencys {
  brandService: IBrandService;
}

@route('/brands')
@before(Authenticate)
export default class BrandsController {

  private readonly brandService: IBrandService;

  constructor(deps: BrandControllerDependencys){
    this.brandService = deps.brandService;
  }

  @route("/")
  @GET()
  public GetAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog('controller','BrandController', 'GetAll', req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.brandService.GetAll(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err){
      next(err);
    }
  }

  @route("/query/")
  @GET()
  public GetByQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog("controller", "BrandsController", "GetByQuery", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.brandService.GetByQuery(args);
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
      activityLog("controller", "BrandController", "GetByID", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.brandService.GetByID(args);
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
      activityLog('controller','BrandController', 'Add', req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.brandService.AddBrand(args);
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
      activityLog('controller','BrandController', 'Edit', req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.brandService.EditBrand(args);
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
      activityLog("controller", "BrandController", "Delete", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.brandService.DeleteBrand(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      next(err);
    }
  }

}