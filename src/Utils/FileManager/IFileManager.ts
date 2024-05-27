import IOperationArgs from "../OperationArgs/IOperationArgs";
import fs from "fs";










export default interface IFileManager {

  GetFileLogs (args: IOperationArgs<string>): fs.ReadStream;
  GetAllLogFileNames (args: IOperationArgs<string>) : Promise<string[]>; 
}