
import { Document, Model, ClientSession, Types } from 'mongoose';
import IGenericRepository from './IGenericRepository';
import ExceptionError from '../ErrorManager/ExceptionError';
import { CodigoHTTP } from '../Enums/codigosHttp';
import IPaginationParams from '../Pagination/IPaginationParams';
import IPaginationResult from '../Pagination/IPaginationResult';




export default class GenericRepository<T extends Document> implements IGenericRepository<T> {
  
  private _model: Model<T>;

  constructor(model: Model<T>){
    this._model = model;
  }

  public create = async (data: T,   session: ClientSession): Promise<T> => {
    try {
      const result = await this._model.create([ data ], { session });
      return result[0] as unknown as T;
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public getAll = async () : Promise<T[]> =>  {
    try {
      return await this._model.find().exec();
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public find = async (condition: object) : Promise<T |null | undefined> => {
    try {
      return await this._model.findOne(condition);
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public findById = async (id: string | Types.ObjectId ): Promise<T | null> => {
    try {
      return await this._model.findById(id).exec();
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }
  
  public update = async (id: string | Types.ObjectId, data: Partial<T>, session: ClientSession): Promise<T | null> => {
    try {
      const options = { new: true, session }
      return await this._model.findByIdAndUpdate(id, data, options).exec();
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public delete = async (id: string | Types.ObjectId, session: ClientSession): Promise<boolean> => {
    try {
      const result = await this._model.findByIdAndDelete(id, { session }).exec();
      return !!result;
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public count = async (filter?:object) : Promise<number> => {
    try {
      
      // countDocuments es significativamente más lento que estimatedDocumentCount
      // pero countDocuments es la unica forma de realizar un conteo con filtrado
      const result = filter ? 
        await this._model.countDocuments(filter) :
        await this._model.estimatedDocumentCount();

      return result;
    }
    catch(err:any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError,
        err.message,
        __filename
      )
    }
  }

  public paginate = async (params:IPaginationParams, filter?:object) : Promise<IPaginationResult<T>> => {
    try {
      const totalItems = await this.count(filter);
      const currentPage = params.currentPage ?? 1;
      const pageSize = params.pageSize ?? totalItems;
      const totalPages = Math.ceil(totalItems / pageSize);
      const skip = (currentPage - 1) * pageSize;
      const data = filter ?  
        await this._model.find(filter).skip(skip).limit(pageSize).exec() :
        await this._model.find().skip(skip).limit(pageSize).exec();

      const result:IPaginationResult<T> = {
        result: data,
        options: {
          pageSize,
          currentPage,
          totalPages,
          totalItems
        }
      }

      return result;
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