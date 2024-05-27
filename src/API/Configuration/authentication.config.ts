import { NextFunction, Request, Response } from "express-serve-static-core";
import { activityLog } from "./logger.config";
import ExceptionError from "../../Utils/ErrorManager/ExceptionError";
import { CodigoHTTP } from "../../Utils/Enums/codigosHttp";
import ITokenManager from "../../Utils/TokenManager/ITokenManager";
import IUsersRepository from "../../Infraestructura/Interfaces/IUsersRepository";
import { JwtPayload } from "jsonwebtoken";
import ObjectIsNotEmpty from "../../Utils/Helpers/empty";


// Validar el token recibido por la etiqueta authorization
export default async function Authenticate(req: Request, res: Response, next: NextFunction){
  try {
    activityLog('middleware','Authenticate', undefined, req.requestID);
    const token = req.headers.authorization;
    const tokenManager = req.container.resolve<ITokenManager>("tokenManager");
    const userRepository = req.container.resolve<IUsersRepository>("userRepository");
   
    if(token){
      const decoded = await tokenManager.Decode(token) as JwtPayload;
      if(ObjectIsNotEmpty(decoded.data)){
        const find = await userRepository.findById(decoded.data._id!);
        if(find){
          req.currentUser = find;
          return next();
        }
        throw new ExceptionError(
          CodigoHTTP.BadRequest,
          "El usuario ingresado es invalido",
          __filename,
        );
      }

      throw new ExceptionError(
        CodigoHTTP.BadRequest,
        "Token Invalido",
        __filename,
      )

    }
    else {
      throw new ExceptionError(
        CodigoHTTP.BadRequest,
        "Error token de authorizacion invalido",
        __filename,
      )
    }
  }
  catch(err){
    next(err);
  }
} 