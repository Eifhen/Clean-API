import { activityLog } from "../../API/Configuration/logger.config";
import { CodigoHTTP } from "../Enums/codigosHttp";
import ExceptionError from "../ErrorManager/ExceptionError";
import IOperationArgs from "../OperationArgs/IOperationArgs";
import IFileManager from "./IFileManager";
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);

interface FileManagerDependencys {

}

export default class FileManager implements IFileManager {
  
  private readonly encoding = "utf-8";
  private readonly chunckSize = 4;
  private path:string;

  constructor(deps: FileManagerDependencys){
    this.path = path.join(__dirname, '../../API/Logs') 
  }

  private GetFullPath = (fileName:string) => {
    const filePath =  path.join(this.path, `logs-${fileName}.txt`);
    return filePath
  }

  public GetFileLogs = (args: IOperationArgs<string>): fs.ReadStream => {
    try {
      activityLog("service", "FileManager", "GetFileLogs", args.requestID);
      const { fileName } = args.params;

      const filePath = this.GetFullPath(fileName);
      const readStream = fs.createReadStream(filePath, {
        encoding: this.encoding,
        highWaterMark: this.chunckSize
      });

      readStream.on("error", (err:any)=>{
        throw new ExceptionError(
          CodigoHTTP.InternalServerError,
          err.message,
          __filename
        )
      })

      return readStream;
    }
    catch(err:any){
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public GetAllLogFileNames = async (args: IOperationArgs<string>): Promise<string[]> => {
    try {
      activityLog("service", "FileManager", "GetAllLogFileNames", args.requestID);
      const files = await readdir(this.path);
      return files.filter((file)=> file.startsWith('logs-') && file.endsWith('.txt'));
    }
    catch(err:any){
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

}