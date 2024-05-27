import IPaginationParams from "./IPaginationParams";



export default interface IPaginationResult<T> {
  result: T[];
  options: IPaginationParams
}