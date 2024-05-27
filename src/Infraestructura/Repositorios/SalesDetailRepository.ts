import SalesDetailModel from "../../Dominio/Entidades/SaleDetailSchema";
import ISalesDetailModel from "../../Dominio/Interfaces/ISaleDetailModel";
import ISalesDetailRepository from "../Interfaces/ISaleDetailRepository";
import GenericRepository from "../../Utils/GenericRepository/GenericRepository";
import { Model } from 'mongoose';





export default class SalesDetailRepository extends GenericRepository<ISalesDetailModel> implements ISalesDetailRepository {
  
  private _saleDetailModel: Model<ISalesDetailModel>;

  constructor(){
    super(SalesDetailModel);
    this._saleDetailModel = SalesDetailModel;
  }

}