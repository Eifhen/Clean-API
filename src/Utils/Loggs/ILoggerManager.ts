import ExceptionError from "../ErrorManager/ExceptionError";




export type LogInfo = 'error' | 'record' | 'server';

export default interface ILoggerManager {


  // AccessFile() : Promise<void>;

  // GetFilePath(date: Date, type: LogInfo) : Promise<string>;

  Register(msg: string, requestID:string): Promise<void>;

  LogException(err:ExceptionError): Promise<void>;

  ServerException(msg: string) : Promise<void>;

}