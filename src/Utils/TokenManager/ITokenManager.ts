import { JwtPayload } from "jsonwebtoken";


export default interface ITokenManager {

  Generate<T>(payload: T): Promise<string>;
  Decode(token:string): Promise<string | JwtPayload>;

}