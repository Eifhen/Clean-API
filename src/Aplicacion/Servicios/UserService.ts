import IUsersRepository from "../../Infraestructura/Interfaces/IUsersRepository";
import { MensajeHTTP, CodigoHTTP } from "../../Utils/Enums/codigosHttp";
import ExceptionError from "../../Utils/ErrorManager/ExceptionError";
import OperationResult from "../../Utils/OperationResult/OperationResult";
import IErrorManager from "../../Utils/ErrorManager/IErrorManager";
import IOperationResult from "../../Utils/OperationResult/IOperationResult";
import IUserService from "../Interfaces/IUserServce";
import { Types } from "mongoose";
import ITransactionManager from "../../Utils/TransactionManager/ITransactionManager";
import { activityLog } from "../../API/Configuration/logger.config";
import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import UserDTO, { validateUserDTO } from "../DTOs/UserDTO";
import UserModel from "../../Dominio/Entidades/UserSchema";
import IPaginationResult from '../../Utils/Pagination/IPaginationResult';
import IPaginationParams from "../../Utils/Pagination/IPaginationParams";


interface UserServiceDependencys {
  userRepository: IUsersRepository;
  errorManager: IErrorManager;
  transactionManager: ITransactionManager;
}

export default class UserService implements IUserService {

  private readonly userRepository: IUsersRepository;
  private readonly transactionManager: ITransactionManager;

  constructor(deps: UserServiceDependencys){
    this.userRepository = deps.userRepository;
    this.transactionManager = deps.transactionManager;
  }

  
  public GetUsersByQuery = async (args: IOperationArgs<IPaginationParams>): Promise<IOperationResult<IPaginationResult<UserDTO>>> => {
    activityLog('service', 'UserService','GetUsersByQuery', args.requestID);
    try {
      const filter = args.query;
      const pagination = await this.userRepository.paginate(args.data, filter);
      const paginationResult:IPaginationResult<UserDTO> = {
        options: pagination.options,
        result: pagination.result.map(m => ({
          fullName: m.FullName,
          age: m.Age,
          registerDate: m.RegisterDate,
          email: m.Email,
          type: m.Type,
          id: m._id.toString(),
          ip_address: m.IP_Address
        }))
      } 
      return new OperationResult<IPaginationResult<UserDTO>>(paginationResult, MensajeHTTP.OK);
    }
    catch(err: any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError, 
        err.message,
        __filename,
      );
    }
  }

  public GetAllUsers = async (args: IOperationArgs<any>): Promise<IOperationResult<UserDTO[]>> => {
    activityLog('service', 'UserService','GetAllUsers', args.requestID);
    try {
      const data = await this.userRepository.getAll();
      const result:UserDTO[] = data.map(m => ({
        fullName: m.FullName,
        age: m.Age,
        registerDate: m.RegisterDate,
        email: m.Email,
        type: m.Type,
        id: m._id.toString(),
        ip_address: m.IP_Address
      }));
      return new OperationResult<UserDTO[]>(result, MensajeHTTP.OK);
    }
    catch(err: any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError, 
        err.message,
        __filename,
      );
    }
  }

  public GetUser = async (args: IOperationArgs<string | Types.ObjectId>): Promise<IOperationResult<UserDTO>> => {
    activityLog('service', 'UserService','GetUser', args.requestID);
    
    try {
      const id = args.params.id;
      const data = await this.userRepository.findById(id);
      if(!data){
        throw new ExceptionError(
          CodigoHTTP.NotFound,
          MensajeHTTP.NotFound,
          __filename,
        )
      }
      
      const result:UserDTO = {
        fullName: data.FullName,
        age: data.Age,
        registerDate: data.RegisterDate,
        email: data.Email,
        type: data.Type,
        id: data._id.toString()
      }

      return new OperationResult<UserDTO>(result, MensajeHTTP.OK);
    }
    catch(err: any){
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError, 
        err.message,
        __filename,
      );
    }
  }
  
  public EditUser = async (args:IOperationArgs<UserDTO>): Promise<IOperationResult<UserDTO>> => {
    activityLog('service', 'UserService','EditUser', args.requestID);
    const session = await this.transactionManager.StartSession();
    try {

      const user = args.data;
      const { isValid, errors } = validateUserDTO(user);
      if(!isValid) {
        throw new Error(errors);
      }

      const model = new UserModel({
        _id: user.id,
        FullName: user.fullName,
        Age: user.age,
        Email: user.email,
        Password: user.password,
        RegisterDate: user.registerDate,
        IP_Address: user.ip_address,
        Type:  user.type
      })

      const updated = await this.userRepository.update(user.id, model, session);
      
      if(!updated){
        throw new ExceptionError(
          CodigoHTTP.NotFound,
          MensajeHTTP.NotFound,
          __filename
        )
      }

      await this.transactionManager.Commit();
      return new OperationResult<UserDTO>(user, MensajeHTTP.Updated);
    }
    catch(err: any){
      await this.transactionManager.RollBack();
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError, 
        err.message,
        __filename,
      );
    }
  }
  
  public AddUser = async (args:IOperationArgs<UserDTO>): Promise<IOperationResult<UserDTO>> => {
    activityLog('service', 'UserService','AddUser', args.requestID);
    const session = await this.transactionManager.StartSession();
    try {
      const user = args.data;
      const { isValid, errors } = validateUserDTO(user);
      if(!isValid) {
        throw new Error(errors);
      }
      
      const model = new UserModel({
        FullName: user.fullName,
        Age: user.age,
        Email: user.email,
        Password: user.password,
        RegisterDate: user.registerDate,
        Type: user.type,
        IP_Address: user.ip_address
      });

      const added:any = await this.userRepository.create(model, session);
      const result:UserDTO = {
        ...user,
        id: added._id.toString()
      }

      await this.transactionManager.Commit();
      return new OperationResult<UserDTO>(result, MensajeHTTP.Created);
    }
    catch(err: any){
      await this.transactionManager.RollBack();
      throw new ExceptionError(
        CodigoHTTP.InternalServerError, 
        err.message,
        __filename,
      );
    }
  }
  
  public DeleteUser = async (args: IOperationArgs<string | Types.ObjectId>): Promise<IOperationResult<boolean>> => {
    activityLog('service', 'UserService','DeleteUser', args.requestID);
    const session = await this.transactionManager.StartSession();
    try {
      const id = args.params.id;
      const deleted = await this.userRepository.delete(id, session);
      if(deleted){
        await this.transactionManager.Commit();
        return new OperationResult<boolean>(deleted, MensajeHTTP.Deleted);
      }

      throw new ExceptionError(
        CodigoHTTP.NotFound,
        MensajeHTTP.NotFound,
        ''
      )
    }
    catch(err: any){
      await this.transactionManager.RollBack();
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError, 
        err.message,
        __filename,
      );
    }
  }

}