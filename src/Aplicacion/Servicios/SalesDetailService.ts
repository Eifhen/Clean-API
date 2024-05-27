import { activityLog } from '../../API/Configuration/logger.config';
import ISalesDetailRepository from "../../Infraestructura/Interfaces/ISaleDetailRepository";
import ISalesRepository from "../../Infraestructura/Interfaces/ISalesRepository";
import { CodigoHTTP, MensajeHTTP } from "../../Utils/Enums/codigosHttp";
import ExceptionError from "../../Utils/ErrorManager/ExceptionError";
import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import IOperationResult from "../../Utils/OperationResult/IOperationResult";
import OperationResult from "../../Utils/OperationResult/OperationResult";
import IPaginationParams, { ValidatePaginationParams } from "../../Utils/Pagination/IPaginationParams";
import IPaginationResult from "../../Utils/Pagination/IPaginationResult";
import ITransactionManager from "../../Utils/TransactionManager/ITransactionManager";
import SalesDetailDTO, { ValidateSalesDetailDTOSchema } from "../DTOs/SalesDetailDTO";
import ISalesDetailService from "../Interfaces/ISalesDetailService";
import SalesDetailModel from "../../Dominio/Entidades/SaleDetailSchema";
import IShoesRepository from '../../Infraestructura/Interfaces/IShoesRepository';


interface ISalesDetailServiceDependencys {
  salesDetailRepository: ISalesDetailRepository;
  transactionManager: ITransactionManager;
  salesRepository: ISalesRepository;
  shoesRepository: IShoesRepository;
}

export default class SalesDetailService implements ISalesDetailService {

  private readonly transactionManager: ITransactionManager;
  private readonly salesDetailRepository: ISalesDetailRepository;
  private readonly salesRepository: ISalesRepository;
  private readonly shoeRepository: IShoesRepository;

  constructor(deps:ISalesDetailServiceDependencys){
    this.salesDetailRepository = deps.salesDetailRepository;
    this.transactionManager = deps.transactionManager;
    this.salesRepository = deps.salesRepository;
    this.shoeRepository = deps.shoesRepository;
  }

 
  public GetAll = async (args: IOperationArgs<any>): Promise<IOperationResult<SalesDetailDTO[]>> => {
    try {
      activityLog("service", "SalesDetailService", "GetAll", args.requestID);
      const data = await this.salesDetailRepository.getAll();
      const result: SalesDetailDTO[] = data.map((m)=> ({
        sale: m.Sale._id,
        shoe: m.Shoe._id,
        price: m.Price,
        id: m._id,
      })); 
      
      return new OperationResult<SalesDetailDTO[]>(result, MensajeHTTP.OK);
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public GetByID = async (args: IOperationArgs<string>): Promise<IOperationResult<SalesDetailDTO>> => {
    try {
      activityLog("service", "SalesDetailService", "GetByID", args.requestID);
      const { id } = args.params;
      const data = await this.salesDetailRepository.findById(id);
      if(!data){
        throw new ExceptionError(
          CodigoHTTP.NotFound,
          MensajeHTTP.NotFound,
          __filename
        )
      }

      const result: SalesDetailDTO = {
        sale: data.Sale._id,
        shoe: data.Shoe._id,
        price: data.Price,
        id: data._id,
      }

      return new OperationResult<SalesDetailDTO>(result, MensajeHTTP.OK);
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message, 
        __filename
      )
    }
  }
  
  public GetByQuery = async (args: IOperationArgs<IPaginationParams>): Promise<IOperationResult<IPaginationResult<SalesDetailDTO>>> => {
    try {
      activityLog("service","SalesDetailService", "GetByQuery", args.requestID);
      const paginationParams = args.data;
      const filter = args.query;
      const { isValid, errors} = ValidatePaginationParams(paginationParams);
      if(!isValid){
        throw new Error(errors);
      }

      const data = await this.salesDetailRepository.paginate(paginationParams, filter);
      const result:IPaginationResult<SalesDetailDTO> = {
        options: data.options,
        result: data.result.map((m)=> ({
          sale: m.Sale._id,
          shoe: m.Shoe._id,
          price: m.Price,
          id: m._id,
        })),
      }

      return new OperationResult<IPaginationResult<SalesDetailDTO>>(result, MensajeHTTP.OK);
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public AddSales = async (args: IOperationArgs<SalesDetailDTO>): Promise<IOperationResult<SalesDetailDTO>> => {
    activityLog("service", "SalesDetailService", "AddSales", args.requestID);
    const session = await this.transactionManager.StartSession();
    try {
      const { isValid, errors } = ValidateSalesDetailDTOSchema(args.data);
      if(!isValid){
        throw new Error(errors);
      }

       // Validamos que la venta exista 
       const findSale = await this.salesRepository.findById(args.data.sale);
       if(!findSale){
         throw new Error("La venta indicada no existe");
       }
 
       // Validamos que el Zapato exista
       const findShoe = await this.shoeRepository.findById(args.data.shoe);
       if(!findShoe){
         throw new Error("El Zapato indicado no existe");
       }
      
      const model = new SalesDetailModel({
        Price: args.data.price,
        Shoe: args.data.shoe,
        Sale: args.data.sale,
      })

      const created = await this.salesDetailRepository.create(model, session);
      const result: SalesDetailDTO = {
        sale: created.Sale._id,
        shoe: created.Shoe._id,
        price: created.Price,
        id: created._id
      }

      await this.transactionManager.Commit();
      return new OperationResult<SalesDetailDTO>(result, MensajeHTTP.Created);
    }
    catch(err:any){
      await this.transactionManager.RollBack();
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public EditSales = async (args: IOperationArgs<SalesDetailDTO>): Promise<IOperationResult<SalesDetailDTO>> => {
    activityLog("service", "SalesDetailService", "EditSales", args.requestID);
    const session = await this.transactionManager.StartSession();
    try {
      const { isValid, errors } = ValidateSalesDetailDTOSchema(args.data);
      if(!isValid){
        throw new Error(errors);
      }

      // Validamos que la venta exista 
      const findSale = await this.salesRepository.findById(args.data.sale);
      if(!findSale){
        throw new Error("La venta indicada no existe");
      }

      // Validamos que el Zapato exista
      const findShoe = await this.shoeRepository.findById(args.data.shoe);
      if(!findShoe){
        throw new Error("El Zapato indicado no existe");
      }

      const model = new SalesDetailModel({
        Price: args.data.price,
        Sale: args.data.sale,
        Shoe: args.data.shoe,
        _id: args.data.id
      })

      const updated = await this.salesDetailRepository.update(model._id, model, session);
      if(!updated){
        throw new Error(MensajeHTTP.NotFound);
      }

      const result:SalesDetailDTO = {
        sale: updated.Sale._id,
        shoe: updated.Shoe._id,
        price: updated.Price,
        id: updated._id
      }
      
      await this.transactionManager.Commit();
      return new OperationResult<SalesDetailDTO>(result, MensajeHTTP.Created);  
    }
    catch(err:any){
      await this.transactionManager.RollBack();
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public DeleteSales = async (args: IOperationArgs<string>): Promise<IOperationResult<boolean>> => {
    activityLog("service", "SalesDetailService", "DeleteSales", args.requestID);
    const session = await this.transactionManager.StartSession();
    try {
      const { id } = args.params;
      const deleted = await this.salesDetailRepository.delete(id, session);
      if(!deleted){
        throw new Error("Error al eliminar el registro");
      }

      await this.transactionManager.Commit();
      return new OperationResult<boolean>(deleted, MensajeHTTP.Deleted);
    }
    catch(err:any){
      await this.transactionManager.RollBack();
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }
}