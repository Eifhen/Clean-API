
import pinoLogger from 'pino';
import { Request } from "express";
import getRequestID from '../../Utils/Helpers/getRequestID';
import isObject from '../../Utils/Helpers/isObject';
export type LoggerType = 'info' | 'warn' | 'error' | 'fatal';
export type Logger = (type: LoggerType | undefined, msg: string | object, obj?: any) => void;
export type ActivityType = 'controller' | 'service' | 'middleware';
export interface ActivityObject {
  type: ActivityType,
  entityName: string,
  entityMethod?: string,
  requestID?: string, 
} 

// Nota esta función debería contener un método 
// para imprimir los logs en un archivo
export class ServerLogger {
  private logger = pinoLogger({
    transport: {
      target: 'pino-pretty',
      options: { 
        colorized: true,
        colorizeObjects: true,
        timestampKey: 'time',
        translateTime: 'SYS:standard',
      }
    }
  });

  public Log = (type: LoggerType = 'info', msg: string|object, obj?:any) => {
    if (type === 'info') return this.logger.info(obj, msg);
    if (type === 'warn') return this.logger.warn(obj, msg);
    if (type === 'error') return this.logger.error(obj, msg);
    if (type === 'fatal') return this.logger.fatal(obj, msg);
  }

  public ActivityLog = (type: ActivityType, entityName: string, entityMethod?:string, element?: string | Request) => {

    let id = undefined;
    if(isObject(element)){
      id = getRequestID(element as Request);
    }
    else {
      id = element;
    }

    if(id && entityMethod){
      this.Log('info', `El ${type} ${entityName} ha ejecutado el metodo ${entityMethod} | Request ID: ${id} `);
    }
    else if(id === undefined && entityMethod === undefined){
      this.Log("info", `El ${type} ${entityName} se ha ejecutado`);
    } 
    else if(id === undefined && entityMethod){
      this.Log('info', `El ${type} ${entityName} ha ejecutado el metodo ${entityMethod}`);
    }
    else if(id && entityMethod === undefined){
      this.Log("info", `El ${type} ${entityName} se ha ejecutado | RequestID: ${id}`);
    }
  }

  
}

const serverLogger = new ServerLogger();
export const logger = serverLogger.Log;
export const activityLog = serverLogger.ActivityLog;