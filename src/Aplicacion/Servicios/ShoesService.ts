import IShoesRepository from "../../Infraestructura/Interfaces/IShoesRepository";
import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import IOperationResult from "../../Utils/OperationResult/IOperationResult";
import IPaginationParams, { ValidatePaginationParams } from "../../Utils/Pagination/IPaginationParams";
import IPaginationResult from "../../Utils/Pagination/IPaginationResult";
import ShoesDTO, { ValidateShoesDTO } from "../DTOs/ShoesDTO";
import IShoesService from "../Interfaces/IShoesService";
import ITransactionManager from '../../Utils/TransactionManager/ITransactionManager';
import ExceptionError from "../../Utils/ErrorManager/ExceptionError";
import { CodigoHTTP, MensajeHTTP } from "../../Utils/Enums/codigosHttp";
import { activityLog } from "../../API/Configuration/logger.config";
import OperationResult from "../../Utils/OperationResult/OperationResult";
import ShoesModel from "../../Dominio/Entidades/ShoesSchema";
import IBrandRepository from "../../Infraestructura/Interfaces/IBrandRepository";

interface ShoesServiceDependencys {
  shoesRepository: IShoesRepository;
  transactionManager: ITransactionManager;
  brandRepository: IBrandRepository;
}


export default class ShoesService implements IShoesService {

  private readonly shoesRepository: IShoesRepository;
  private readonly transactionManager: ITransactionManager;
  private readonly brandRepository: IBrandRepository;

  constructor(deps: ShoesServiceDependencys){
    this.shoesRepository = deps.shoesRepository;
    this.transactionManager = deps.transactionManager;
    this.brandRepository = deps.brandRepository;
  }

  public GetByID = async (args: IOperationArgs<string>): Promise<IOperationResult<ShoesDTO>> => {
    try {
      activityLog("service", "ShoesService", "GetByID", args.requestID);
      const { id } = args.params;
      const find = await this.shoesRepository.findById(id);
      if(!find){
        throw new ExceptionError(
          CodigoHTTP.NotFound,
          MensajeHTTP.NotFound,
          __filename
        )
      }

      const result: ShoesDTO = {
        name: find.Name,
        size: find.Size,
        color: find.Color,
        stock: find.Stock,
        brand: find.Brand._id.toString(),
        price: find.Price,
        id: find._id.toString()
      }

      return new OperationResult<ShoesDTO>(result, MensajeHTTP.OK);
    }
    catch(err:any){
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public GetAll = async (args: IOperationArgs<any>): Promise<IOperationResult<ShoesDTO[]>> => {
    try {
      activityLog("service", "ShoesService", "GetAll", args.requestID);
      const data = await this.shoesRepository.getAll();
      const result = data.map((m)=>({
        name: m.Name,
        size: m.Size,
        color: m.Color,
        stock: m.Stock,
        brand: m.Brand._id.toString(),
        price: m.Price,
        id: m._id.toString()
      }));

      return new OperationResult<ShoesDTO[]>(result, MensajeHTTP.OK);
    }
    catch(err:any){
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public GetByQuery = async (args: IOperationArgs<IPaginationParams>): Promise<IOperationResult<IPaginationResult<ShoesDTO>>> => {
    try {
      activityLog("service", "ShoesService", "GetByQuery", args.requestID);
      const filter = args.query;
      const paginationParams = args.data;
      const { isValid, errors } = ValidatePaginationParams(paginationParams);
      if(!isValid){
        throw new Error(errors);
      }

      const data = await this.shoesRepository.paginate(paginationParams, filter);
      const result:IPaginationResult<ShoesDTO> = {
        options: data.options,
        result: data.result.map((m)=>({
          name: m.Name,
          size: m.Size,
          color: m.Color,
          stock: m.Stock,
          brand: m.Brand._id.toString(),
          price: m.Price,
          id: m._id.toString()  
        }))
      }

      return new OperationResult<IPaginationResult<ShoesDTO>>(result, MensajeHTTP.OK);

    }
    catch(err:any){
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public AddShoes = async (args: IOperationArgs<ShoesDTO>): Promise<IOperationResult<ShoesDTO>> => {
    activityLog("service", "ShoesService", "AddShoes", args.requestID);
    const session = await this.transactionManager.StartSession();
    try {
      const { isValid, errors } = ValidateShoesDTO(args.data);
      if(!isValid){
        throw new Error(errors);
      }

      // Validamos que el Brand ingresado exista
      const findBrand = await this.brandRepository.findById(args.data.brand.toString());
      if(!findBrand){
        throw new Error("La marca ingresada no está registrada");
      }

      const model = new ShoesModel({
        Name: args.data.name,
        Size: args.data.size,
        Color: args.data.color,
        Stock: args.data.stock,
        Brand: findBrand,
        Price: args.data.price,
      });

      const createdShoes = await this.shoesRepository.create(model, session);
      args.data.id = createdShoes._id.toString();
      
      await this.transactionManager.Commit();
      return new OperationResult<ShoesDTO>(args.data, MensajeHTTP.OK);
    }
    catch(err:any){
      await this.transactionManager.RollBack();
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public EditShoes = async (args: IOperationArgs<ShoesDTO>): Promise<IOperationResult<ShoesDTO>> => {
    activityLog("service", "ShoesService", "EditShoes", args.requestID);
    const session = await this.transactionManager.StartSession();
    try {
      const { isValid, errors } = ValidateShoesDTO(args.data);
      if(!isValid){
        throw new Error(errors);
      }

      // Validamos que el brand ingresado exista
      const findBrand = await this.brandRepository.findById(args.data.brand.toString());
      if(!findBrand){
        throw new Error("La marca ingresada no está registrada");
      }
      
      const model = new ShoesModel({
        Name: args.data.name,
        Size: args.data.size,
        Color: args.data.color,
        Stock: args.data.stock,
        Brand: findBrand,
        Price: args.data.price,
        _id: args.data.id
      });

      await this.shoesRepository.update(args.data.id?.toString()!, model, session);
      await this.transactionManager.Commit();
      return new OperationResult<ShoesDTO>(args.data, MensajeHTTP.OK);
    }
    catch(err:any){
      await this.transactionManager.RollBack();
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public DeleteShoes = async (args: IOperationArgs<string>): Promise<IOperationResult<boolean>> => {
    activityLog("service", "ShoesService", "DeleteShoes", args.requestID);
    const session = await this.transactionManager.StartSession();
    try {
      const { id } = args.params;
      const toDelete = await this.shoesRepository.delete(id, session);
      if(!toDelete){
        throw new Error("Error al eliminar el registro");
      }

      await this.transactionManager.Commit();
      return new OperationResult<boolean>(toDelete, MensajeHTTP.Deleted);
    }
    catch(err:any){
      await this.transactionManager.RollBack();
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }
}