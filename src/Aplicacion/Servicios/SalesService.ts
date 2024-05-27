import { activityLog } from "../../API/Configuration/logger.config";
import SalesModel from "../../Dominio/Entidades/SaleSchema";
import ISalesModel from "../../Dominio/Interfaces/ISalesModel";
import ISalesRepository from "../../Infraestructura/Interfaces/ISalesRepository";
import IUsersRepository from "../../Infraestructura/Interfaces/IUsersRepository";
import { CodigoHTTP, MensajeHTTP } from "../../Utils/Enums/codigosHttp";
import ExceptionError from "../../Utils/ErrorManager/ExceptionError";
import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import IOperationResult from "../../Utils/OperationResult/IOperationResult";
import OperationResult from "../../Utils/OperationResult/OperationResult";
import IPaginationParams, { ValidatePaginationParams } from "../../Utils/Pagination/IPaginationParams";
import IPaginationResult from "../../Utils/Pagination/IPaginationResult";
import ITransactionManager from "../../Utils/TransactionManager/ITransactionManager";
import SalesDTO, { ValidateSalesDTO } from "../DTOs/SalesDTO";
import ISalesService from "../Interfaces/ISalesService";



interface ISalesServiceDependencys {
  salesRepository: ISalesRepository;
  userRepository: IUsersRepository;
  transactionManager: ITransactionManager;
}


export default class SalesService implements ISalesService {

  private readonly salesRepository: ISalesRepository;
  private readonly transactionManager: ITransactionManager;
  private readonly userRepository: IUsersRepository;

  constructor(deps: ISalesServiceDependencys){
    this.salesRepository = deps.salesRepository;
    this.userRepository = deps.userRepository;
    this.transactionManager = deps.transactionManager;
  }
  
  public GetAll = async (args: IOperationArgs<any>): Promise<IOperationResult<SalesDTO[]>> => {
    try {
      activityLog('service','SalesService', 'GetAll', args.requestID);
      const data:ISalesModel[] = await this.salesRepository.getAll();
      const result:SalesDTO[] = data.map(m => ({
        id: m._id,
        total: m.Total,
        client: m.Client._id,
        seller: m.Seller._id,
        date: m.Date,        
      }));
      return new OperationResult<SalesDTO[]>(result, MensajeHTTP.Accepted);
    }
    catch(err:any){
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public GetByID = async (args: IOperationArgs<string>): Promise<IOperationResult<SalesDTO>> => {
    try {
      activityLog("service", "SalesService","GetByID", args.requestID);
      const { id } = args.params;
      const data = await this.salesRepository.findById(id);
      if(!data){
        throw new ExceptionError(
          CodigoHTTP.NotFound,
          MensajeHTTP.NotFound,
          __filename
        );
      }
      const result: SalesDTO = {
        id: data._id,
        total: data.Total,
        client: data.Client._id,
        seller: data.Seller._id,
        date: data.Date
      }
      return new OperationResult<SalesDTO>(result, MensajeHTTP.OK);
    }
    catch(err:any){
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public GetByQuery = async (args: IOperationArgs<IPaginationParams>): Promise<IOperationResult<IPaginationResult<SalesDTO>>> => {
    try {
      activityLog('service','SalesService', 'GetByQuery', args.requestID);
      const filter = args.query;
      const options = args.data;
      const { isValid, errors } = ValidatePaginationParams(options);
      if(!isValid){
        throw new Error(errors);
      }

      const data = await this.salesRepository.paginate(options, filter);
      const pagination:IPaginationResult<SalesDTO> = {
        options: data.options,
        result: data.result.map(m => ({
          id: m._id,
          client: m.Client._id,
          seller: m.Seller._id,
          total: m.Total,
          date: m.Date
        })),
      }
      return new OperationResult(pagination, MensajeHTTP.OK);
    }
    catch(err:any){
      throw new ExceptionError(
        err.status ?? CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public AddSales = async (args: IOperationArgs<SalesDTO>): Promise<IOperationResult<SalesDTO>> => {
    activityLog('service', 'SalesService', 'AddSales', args.requestID);
    const session = await this.transactionManager.StartSession();
    try {
      const sale = args.data;
      const { isValid, errors } = ValidateSalesDTO(sale);
      if(!isValid){
        throw new Error(errors);
      }

      // Validar que el cliente exista
      const cliente = await this.userRepository.findById(sale.client);
      if(!cliente){
        throw new Error('El cliente ingresado en esta venta no esta registrado');
      }
      
      // Validar que el vendedor exista
      const vendedor = await this.userRepository.findById(sale.seller);
      if(!vendedor){
        throw new Error("El vendedor ingresado en esta venta no esta registrado");
      }

      const model = new SalesModel({
        Total: sale.total,
        Client: cliente,
        Seller: vendedor,
        Date: sale.date
      });

      const createdSale = await this.salesRepository.create(model, session);
      const result:SalesDTO = {
        id: createdSale._id,
        total:createdSale.Total,
        client: createdSale.Client._id,
        seller: createdSale.Seller._id,
        date: createdSale.Date
      }

      await this.transactionManager.Commit();
      return new OperationResult<SalesDTO>(result, MensajeHTTP.Created);

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

  public EditSales = async (args: IOperationArgs<SalesDTO>): Promise<IOperationResult<SalesDTO>> => {
    activityLog('service', 'SalesService', 'EditSales', args.requestID);
    const session = await this.transactionManager.StartSession();
    try {
      const sale = args.data;
      if(!sale.id){
        throw new Error('Error la venta ingresada es invalida');
      }

      const { isValid, errors } = ValidateSalesDTO(sale);
      if(!isValid){
        throw new Error(errors);
      }

      // Validar que el cliente exista
      const cliente = await this.userRepository.findById(sale.client);
      if(!cliente){
        throw new Error('El cliente ingresado en esta venta no esta registrado');
      }
      
      // Validar que el vendedor exista
      const vendedor = await this.userRepository.findById(sale.seller);
      if(!vendedor){
        throw new Error("El vendedor ingresado en esta venta no esta registrado");
      }

      const model = new SalesModel({
        _id: sale.id,
        Total: sale.total,
        Client: cliente._id,
        Seller: vendedor._id,
        Date: sale.date,
      })

      const updated = await this.salesRepository.update(sale.id, model, session);

      if(!updated){
      throw new ExceptionError(
        CodigoHTTP.NotFound,
        MensajeHTTP.NotFound,
        __filename
      )
    }

      await this.transactionManager.Commit();
      return new OperationResult<SalesDTO>(sale, MensajeHTTP.Updated);
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

  public DeleteSales = async (args: IOperationArgs<string>): Promise<IOperationResult<boolean>> => {
    activityLog('service', 'SalesService', 'DeleteSales', args.requestID);
    const session = await this.transactionManager.StartSession();
    try {
      const { id } = args.params;
      
      const deleted = await this.salesRepository.delete(id, session);

      if(!deleted){
        throw new Error("Error al eliminar el registro");
      }

      await this.transactionManager.Commit();
      return new OperationResult<boolean>(deleted, MensajeHTTP.Deleted);
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