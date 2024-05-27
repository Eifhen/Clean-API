import { GET, before, route } from "awilix-express";
import Authenticate from "../Configuration/authentication.config";
import { NextFunction, Request, Response } from "express";
import { activityLog } from "../Configuration/logger.config";
import IFileManager from "../../Utils/FileManager/IFileManager";
import { CodigoHTTP } from "../../Utils/Enums/codigosHttp";
import OperationArgs from "../../Utils/OperationArgs/OperationArgs";
import { P } from "pino";



interface FileControllerDependencys {
  fileManager: IFileManager;
}


@route("/file")
@before(Authenticate)
export default class FileController {

  private readonly fileManager: IFileManager;

  constructor(deps: FileControllerDependencys){
    this.fileManager = deps.fileManager;
  }


  @route("/logs/:fileName")
  @GET()
  public GetLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog("controller", "FileController", "GetLogs", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const stream = await this.fileManager.GetFileLogs(args);

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; fileName= "logs-${req.params.fileName}.txt"`);
      
      stream.pipe(res);
    }
    catch(err:any){
      next(err);
    }
  }

  @route("/logs")
  @GET()
  public GetAllLogFileNames = async (req: Request, res: Response, next: NextFunction) => {
    try {
      activityLog("controller", "FileController", "GetAllLogFileNames", req.requestID);
      const args = new OperationArgs(req.requestID, req.query, req.params, req.body);
      const files = await this.fileManager.GetAllLogFileNames(args);
      return res.status(CodigoHTTP.OK).send(files);
    }
    catch(err:any){
      next(err);
    }
  } 


}