import { DELETE, GET, POST, PUT, before, route } from "awilix-express";
import Authenticate from "../Configuration/authentication.config";
import { NextFunction, Request, Response } from "express";
import { CodigoHTTP } from "../../Utils/Enums/codigosHttp";
import IUserService from "../../Aplicacion/Interfaces/IUserServce";
import { activityLog } from "../Configuration/logger.config";
import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import OperationArgs from "../../Utils/OperationArgs/OperationArgs";

interface UserControllerDependencys {
  userService: IUserService;
}

@route("/users")
@before(Authenticate)
export default class UserController {

  private readonly userService: IUserService;

  constructor(deps: UserControllerDependencys){
    this.userService = deps.userService;
  }

  @route("/")
  @GET()
  public GetAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog("controller", "UserController", "GetAll", req.requestID);
      const args: IOperationArgs<any> = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.userService.GetAllUsers(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      return next(err);
    }
  }

  @route("/query/")
  @GET()
  public GetByQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog("controller", "UserController", "GetByQuery", req.requestID);
      console.log("params =>", req.query);
      const args: IOperationArgs<any> = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.userService.GetUsersByQuery(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      return next(err);
    }
  }

  @route("/:id")
  @GET()
  public Get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog("controller", "UserController", "Get", req.requestID);
      const args: IOperationArgs<any> = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.userService.GetUser(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      return next(err);
    }
  }

  @route("/:id")
  @DELETE()
  public Delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog("controller", "UserController", "Delete", req.requestID);
      const args: IOperationArgs<any> = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.userService.DeleteUser(args);
      console.log("RESULT =>", result);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      return next(err);
    }
  }

  @route("/")
  @PUT()
  public Update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog("controller", "UserController", "Update", req.requestID);
      const args: IOperationArgs<any> = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.userService.EditUser(args);
      return res.status(CodigoHTTP.Updated).send(result);
    }
    catch(err:any){
      return next(err);
    }
  }

  @route("/")
  @POST()
  public Add = async(req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog("controller", "UserController", "Add", req.requestID);
      const args: IOperationArgs<any> = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.userService.AddUser(args);
      return res.status(CodigoHTTP.Created).send(result);
    }
    catch(err:any){
      return next(err);
    }
  }

}