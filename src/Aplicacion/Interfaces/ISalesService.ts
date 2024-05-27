import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import IOperationResult from "../../Utils/OperationResult/IOperationResult";
import IPaginationParams from "../../Utils/Pagination/IPaginationParams";
import IPaginationResult from "../../Utils/Pagination/IPaginationResult";
import SalesDTO from "../DTOs/SalesDTO";


export default interface ISalesService {
  AddSales(args: IOperationArgs<SalesDTO>) : Promise<IOperationResult<SalesDTO>>;
  EditSales(args: IOperationArgs<SalesDTO>) : Promise<IOperationResult<SalesDTO>>;
  DeleteSales(args: IOperationArgs<string>) : Promise<IOperationResult<boolean>>;
  GetByID(args: IOperationArgs<string>) : Promise<IOperationResult<SalesDTO>>;
  GetAll(args: IOperationArgs<any>) : Promise<IOperationResult<SalesDTO[]>>;
  GetByQuery(args: IOperationArgs<IPaginationParams>) : Promise<IOperationResult<IPaginationResult<SalesDTO>>>;
}