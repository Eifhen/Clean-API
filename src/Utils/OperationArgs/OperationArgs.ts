import getRequestID from "../Helpers/getRequestID";
import IOperationArgs from "./IOperationArgs";
import { Request } from 'express';




export default class OperationArgs<T> implements IOperationArgs<T> {
  public requestID: string;
  public data: T;
  public query: any;
  public params: any;

  constructor(reqID:string, query:any, params:any, data:T){
    this.data = data;
    this.query = query;
    this.requestID = reqID;
    this.params = params;
  }
}