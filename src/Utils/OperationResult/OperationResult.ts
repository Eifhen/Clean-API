import IOperationResult from "./IOperationResult";






export default class OperationResult<T> implements IOperationResult<T> {
  public requestID?: string | undefined;
  public data: T;
  public message: string;
  public redirect?: string | undefined;

  constructor(_data:T, _message:string, _redirect?:string, _requestID?: string, ){
    this.data = _data;
    this.message = _message;
    this.redirect = _redirect;
    this.requestID = _requestID;
  }

}