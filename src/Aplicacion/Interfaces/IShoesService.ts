import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import IOperationResult from "../../Utils/OperationResult/IOperationResult";
import IPaginationParams from "../../Utils/Pagination/IPaginationParams";
import IPaginationResult from "../../Utils/Pagination/IPaginationResult";
import ShoesDTO from "../DTOs/ShoesDTO";



export default interface IShoesService {
  GetByID(args: IOperationArgs<string>) : Promise<IOperationResult<ShoesDTO>>;
  GetAll(args: IOperationArgs<any>) : Promise<IOperationResult<ShoesDTO[]>>;
  GetByQuery(args: IOperationArgs<IPaginationParams>) : Promise<IOperationResult<IPaginationResult<ShoesDTO>>>;

  AddShoes(args: IOperationArgs<ShoesDTO>) : Promise<IOperationResult<ShoesDTO>>;
  EditShoes(args: IOperationArgs<ShoesDTO>) : Promise<IOperationResult<ShoesDTO>>;
  DeleteShoes(args: IOperationArgs<string>) : Promise<IOperationResult<boolean>>;
}