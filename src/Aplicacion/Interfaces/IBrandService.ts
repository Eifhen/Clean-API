import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import IOperationResult from "../../Utils/OperationResult/IOperationResult";
import IPaginationParams from "../../Utils/Pagination/IPaginationParams";
import IPaginationResult from "../../Utils/Pagination/IPaginationResult";
import BrandDTO from "../DTOs/BrandDTO";




export default interface IBrandService {
  AddBrand(args: IOperationArgs<BrandDTO>) : Promise<IOperationResult<BrandDTO>>;
  EditBrand(args: IOperationArgs<BrandDTO>) : Promise<IOperationResult<BrandDTO>>;
  DeleteBrand(args: IOperationArgs<string>) : Promise<IOperationResult<boolean>>;
  GetByID(args: IOperationArgs<string>) : Promise<IOperationResult<BrandDTO>>;
  GetAll(args: IOperationArgs<any>) : Promise<IOperationResult<BrandDTO[]>>;
  GetByQuery(args: IOperationArgs<IPaginationParams>) : Promise<IOperationResult<IPaginationResult<BrandDTO>>>;
}