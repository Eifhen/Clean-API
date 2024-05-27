import { NextFunction, Response, Request } from "express";





export default interface IApiKeyManager {

  ValidateApiKey(req: Request, res: Response, next: NextFunction) : Promise<void>
}