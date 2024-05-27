import { POST, route } from "awilix-express";
import IAuthenticationService from "../../Aplicacion/Interfaces/IAuthenticationService";
import { NextFunction, Request, Response } from "express";
import { activityLog } from "../Configuration/logger.config";
import { CodigoHTTP } from "../../Utils/Enums/codigosHttp";
import getRequestID from "../../Utils/Helpers/getRequestID";
import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import OperationArgs from "../../Utils/OperationArgs/OperationArgs";
import ISignUpServiceDTO from "../../Aplicacion/DTOs/SignUpServiceDTO";
import SignInDTO from "../../Aplicacion/DTOs/SignInDTO";

interface AuthenticationControllerDependencys {
  authenticationService: IAuthenticationService;
}

@route('/authentication')
export default class AuthenticationController {

  private authenticationService: IAuthenticationService;

  constructor(deps: AuthenticationControllerDependencys){
    this.authenticationService = deps.authenticationService;
  }

  @route('/sign-up')
  @POST()
  SignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog('controller','AuthenticationController', 'SignUp', req.requestID);
      const args:IOperationArgs<ISignUpServiceDTO> = new OperationArgs(req.requestID, req.query, req.params, {
        signUpData: req.body,
        ip_address: req.ip
      });
      const result = await this.authenticationService.SignUp(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      return next(err);
    }
  }
 
  @route('/sign-in')
  @POST()
  SignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog('controller','AuthenticationController', 'SignIn', req);
      const args:IOperationArgs<SignInDTO> = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const result = await this.authenticationService.SignIn(args);
      return res.status(CodigoHTTP.OK).send(result);
    }
    catch(err:any){
      return next(err);
    }
  }

}