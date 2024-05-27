import { logger } from "../../API/Configuration/logger.config";
import { CodigoHTTP, MensajeHTTP } from "../Enums/codigosHttp";
import ExceptionError from "../ErrorManager/ExceptionError";
import ILoggerManager, { LogInfo } from "./ILoggerManager";
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export default class LoggerManager implements ILoggerManager {

  private path:string;

  constructor(){
    this.path = path.join(__dirname, '../../API/Logs') 
  }

  private AccessFile = async () : Promise<void> => {
    try {
      await fs.access(this.path);
    }
    catch(err:any){
      await fs.mkdir(this.path, {recursive: true})
    }
  }

  private GetFilePath = async (data: Date, type: LogInfo): Promise<string> => {
    // Format date as YYYY-MM-DD
    const fileDate = data.toISOString().split("T")[0];
    return path.join(this.path, `logs-${fileDate}.txt`);
  }

  private LogData = async (msg:string, stack:string, type: LogInfo, requestID?: string|string[]) => {
    try {
      await this.AccessFile();
      const id = uuidv4().slice(0, 8);
      const filePath = await this.GetFilePath(new Date(), type);
      const logMsg = `\n## Error ID: ${id} \n## Request ID: ${requestID} \n## Type: ${type.toUpperCase()} \n## Date: ${new Date().toISOString().split("T")} \n## Message: ${msg} \n## Description: ${stack} \n\n`;

      await fs.appendFile(filePath, logMsg);
    }
    catch(err:any){
      logger('error', 'Error al insertar log en el archivo', err.message);
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        `${MensajeHTTP.InternalServerError} | Error al insertar logs.`,
        __filename,
      )
    }
  }

  public Register = async (msg: string, requestID?: string|string[]) => {
    await this.LogData(msg, '', 'record', requestID);
  } 

  public LogException = async (err: ExceptionError) : Promise<void> => {
    await this.LogData(err.message, err.stack ?? '', 'error', err.requestID);
  }

  public ServerException = async (msg: string): Promise<void> => {
    await this.LogData(msg, '', 'server');
  }
}