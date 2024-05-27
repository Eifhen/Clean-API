








export default interface IOperationResult<T> {
  data: T,
  requestID?: string,
  message: string,
  redirect?: string,
}