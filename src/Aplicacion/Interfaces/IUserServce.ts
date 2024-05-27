import { Types } from "mongoose";
import IUserModel from "../../Dominio/Interfaces/IUserModel";
import IOperationResult from "../../Utils/OperationResult/IOperationResult";
import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import UserDTO from "../DTOs/UserDTO";
import IPaginationResult from "../../Utils/Pagination/IPaginationResult";
import IPaginationParams from "../../Utils/Pagination/IPaginationParams";




export default interface IUserService {
  GetUser(args: IOperationArgs<string | Types.ObjectId>): Promise<IOperationResult<UserDTO>>;
  GetAllUsers(args: IOperationArgs<any>): Promise<IOperationResult<UserDTO[]>>;
  GetUsersByQuery(args: IOperationArgs<IPaginationParams>) : Promise<IOperationResult<IPaginationResult<UserDTO>>>
  EditUser(args: IOperationArgs<UserDTO>): Promise<IOperationResult<UserDTO>>;
  AddUser(args: IOperationArgs<UserDTO>): Promise<IOperationResult<UserDTO>>;
  DeleteUser(args: IOperationArgs<string | Types.ObjectId>): Promise<IOperationResult<boolean>>;
}