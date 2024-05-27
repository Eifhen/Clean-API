
import mongoose, { Document, Types } from 'mongoose';
import IPaginationResult from '../Pagination/IPaginationResult';
import IPaginationParams from '../Pagination/IPaginationParams';



export default interface IGenericRepository<T extends Document> {

  getAll() : Promise<T[]>;
  find(condition: object) : Promise<T | null | undefined>;
  findById(id: string | Types.ObjectId) : Promise<T | null>;
  create(data: T, session?: mongoose.ClientSession): Promise<T>;
  update(id: string | Types.ObjectId , data: Partial<T>, session?: mongoose.ClientSession) : Promise<T | null>;
  delete(id:string | Types.ObjectId , session?: mongoose.ClientSession) : Promise<boolean>;
  count(filter?:object) : Promise<number>;
  paginate(params: IPaginationParams, filter?:object) : Promise<IPaginationResult<T>>;
}