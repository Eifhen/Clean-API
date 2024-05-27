




export default interface IOperationArgs<T> {
  requestID: string;
  query?: any;
  params?: any;
  data: T;
}