


export interface IExceptionError extends Error {
  status: number;
  path: string;
  name: string;
  date: Date
}


export default class ExceptionError extends Error implements IExceptionError {

  public status:number;
  public requestID?: string | string[];
  public name: string;
  public path: string;
  public date: Date;

  constructor(status: number, message: string, path:string, requestID?:string) {
    super(message);
    this.status = status;
    this.requestID = requestID;
    this.name = 'RequestError';
    this.path = path;
    this.date = new Date();
  }

}