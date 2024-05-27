import IConfiguration from "../../API/Interfaces/IConfigurations";
import ITokenManager from "./ITokenManager";
import Configuration from '../../API/Configuration/configurations';
import jwt, { JwtPayload } from 'jsonwebtoken';
import IErrorManager from "../ErrorManager/IErrorManager";
import ExceptionError from "../ErrorManager/ExceptionError";
import { CodigoHTTP } from "../Enums/codigosHttp";


interface TokenManagerDependencys {
  configuration: IConfiguration;
}

export default class TokenManager implements ITokenManager {

  private readonly configuration: IConfiguration;
  private readonly secret: string;

  constructor(deps: TokenManagerDependencys){
    this.configuration = deps.configuration;
    this.secret = this.configuration.settings.TK_Key;
  }

  public Generate = async <T>(payload: T) : Promise<string> => {
    try {
      const data = { data: payload };
      return jwt.sign(data, this.secret, {
        algorithm: "HS256"
      });
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        "Error al generar el token",
        __filename
      )
    }
  }

  public Decode = async (token: string) : Promise<string | JwtPayload> => {
    try {
      const tk = token.split(" ")[1];  // quitamos el Bearer
      const decoded = jwt.verify(tk, this.secret);
      return decoded;
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        "Error al decodificar el token",
        __filename
      )
    }
  }

}