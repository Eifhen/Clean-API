import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import IOperationResult from "../../Utils/OperationResult/IOperationResult";
import IPaginationParams from "../../Utils/Pagination/IPaginationParams";
import IPaginationResult from "../../Utils/Pagination/IPaginationResult";
import SalesDetailDTO from "../DTOs/SalesDetailDTO";




export default interface ISalesDetailService {
 
  GetByID(args: IOperationArgs<string>) : Promise<IOperationResult<SalesDetailDTO>>;
  GetAll(args: IOperationArgs<any>) : Promise<IOperationResult<SalesDetailDTO[]>>;
  GetByQuery(args: IOperationArgs<IPaginationParams>) : Promise<IOperationResult<IPaginationResult<SalesDetailDTO>>>;

  AddSales(args: IOperationArgs<SalesDetailDTO>) : Promise<IOperationResult<SalesDetailDTO>>;
  EditSales(args: IOperationArgs<SalesDetailDTO>) : Promise<IOperationResult<SalesDetailDTO>>;
  DeleteSales(args: IOperationArgs<string>) : Promise<IOperationResult<boolean>>;
}