import { activityLog } from "../../API/Configuration/logger.config";
import BrandModel from "../../Dominio/Entidades/BrandSchema";
import IBrandRepository from "../../Infraestructura/Interfaces/IBrandRepository";
import { CodigoHTTP, MensajeHTTP } from "../../Utils/Enums/codigosHttp";
import ExceptionError from "../../Utils/ErrorManager/ExceptionError";
import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import IOperationResult from "../../Utils/OperationResult/IOperationResult";
import OperationResult from "../../Utils/OperationResult/OperationResult";
import IPaginationParams from "../../Utils/Pagination/IPaginationParams";
import IPaginationResult from "../../Utils/Pagination/IPaginationResult";
import ITransactionManager from "../../Utils/TransactionManager/ITransactionManager";
import BrandDTO, { validateBrandDTO } from "../DTOs/BrandDTO";
import IBrandService from "../Interfaces/IBrandService";


interface BrandServiceDependencys {
  brandRepository: IBrandRepository;
  transactionManager: ITransactionManager;
}

export default class BrandService implements IBrandService {
  
  private readonly brandRepository: IBrandRepository
  private readonly transactionManager: ITransactionManager;

  constructor(deps: BrandServiceDependencys){
    this.brandRepository = deps.brandRepository;
    this.transactionManager = deps.transactionManager;
  }

  public AddBrand = async (args: IOperationArgs<BrandDTO>): Promise<IOperationResult<BrandDTO>> => {
    activityLog('service','BrandService', 'AddBrand', args.requestID);
    const session = await this.transactionManager.StartSession();

    try {
      const data = args.data;
      const { isValid, errors } = validateBrandDTO(data);
      if(!isValid){
        throw new Error(errors);
      }

      const model = new BrandModel({
        Name: data.name,
        Country: data.country
      });

      const added = await this.brandRepository.create(model, session);

      const result:BrandDTO = {
        name: added.Name,
        country: added.Country,
        id: added._id
      }

      await this.transactionManager.Commit();
      return new OperationResult<BrandDTO>(result, MensajeHTTP.Created);
    }
    catch(err:any){
      await this.transactionManager.RollBack();
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message ?? MensajeHTTP.InternalServerError,
        __filename
      )
    }
  }
  
  public EditBrand = async (args: IOperationArgs<BrandDTO>): Promise<IOperationResult<BrandDTO>> => {
    activityLog('service','BrandService', 'EditBrand', args.requestID);
    const session = await this.transactionManager.StartSession();
    try {
      const { isValid, errors } = validateBrandDTO(args.data);
      if(!isValid){
        throw new Error(errors);
      }

      if(!args.data.id){
        throw new Error('ID invalido');
      }

      const model = new BrandModel({
        Name: args.data.name,
        Country: args.data.country,
        _id: args.data.id
      });

      const data = await this.brandRepository.update(args.data.id, model, session);
      if(!data){
        throw new Error(MensajeHTTP.NotFound);
      }

      const result:BrandDTO = {
        name: data.Name,
        country: data.Country,
        id:data._id,
      }

      await this.transactionManager.Commit();
      return new OperationResult<BrandDTO>(result, MensajeHTTP.Updated);
    }
    catch(err:any){
      await this.transactionManager.RollBack();
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message ?? MensajeHTTP.InternalServerError,
        __filename
      )
    }
  }

  public DeleteBrand = async (args: IOperationArgs<string>): Promise<IOperationResult<boolean>> => {
    const session = await this.transactionManager.StartSession();
    try {
      activityLog('service','BrandService', 'DeleteBrand', args.requestID);
      const { id } = args.params;
      const deleted = await this.brandRepository.delete(id, session);
      
      if(!deleted){
        throw new ExceptionError(
          CodigoHTTP.NotFound,
          MensajeHTTP.NotFound,
          ''
        );
      }
      
      await this.transactionManager.Commit();
      return new OperationResult(deleted, MensajeHTTP.Deleted);
    }
    catch(err:any){
      this.transactionManager.RollBack();
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message ?? MensajeHTTP.InternalServerError,
        __filename
      );
    }
  }

  public GetByID = async (args: IOperationArgs<string>): Promise<IOperationResult<BrandDTO>> => {
    try {
      activityLog('service','BrandService', 'GetByID', args.requestID);
      const { id } = args.params;
      const data = await this.brandRepository.findById(id);
      
      if(!data){
        throw new ExceptionError(
          CodigoHTTP.NotFound,
          MensajeHTTP.NotFound,
          __filename
        )
      }

      const result:BrandDTO = {
        name: data.Name,
        country: data.Country,
        id: data._id
      }

      return new OperationResult<BrandDTO>(result, MensajeHTTP.Accepted);
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public GetAll = async (args: IOperationArgs<any>): Promise<IOperationResult<BrandDTO[]>> => {
    try {
      activityLog('service','BrandService', 'GetAll', args.requestID);
      const data = await this.brandRepository.getAll();
      const result: BrandDTO[] = data.map(m => ({
        name: m.Name,
        country: m.Country,
        id: m._id
      }));
      return new OperationResult<BrandDTO[]>(result, MensajeHTTP.Accepted);
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message ?? MensajeHTTP.InternalServerError,
        __filename
      )
    }
  }

  public GetByQuery = async (args: IOperationArgs<IPaginationParams>): Promise<IOperationResult<IPaginationResult<BrandDTO>>> => {
    try {
      activityLog('service','BrandService', 'GetByQuery', args.requestID);
      const filter = args.query;
      const data = await this.brandRepository.paginate(args.data, filter);
      const pagination: IPaginationResult<BrandDTO> = {
        options: data.options,
        result: data.result.map((m)=>({
          name: m.Name,
          country: m.Country,
          id: m._id.toString() 
        })),
      }

      return new OperationResult(pagination, MensajeHTTP.Accepted);
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

}