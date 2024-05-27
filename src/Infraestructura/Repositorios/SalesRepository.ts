import SalesModel from "../../Dominio/Entidades/SaleSchema";
import ISalesModel from "../../Dominio/Interfaces/ISalesModel";
import ISalesRepository from "../Interfaces/ISalesRepository";
import GenericRepository from "../../Utils/GenericRepository/GenericRepository";
import { Model } from 'mongoose';



export default class SalesRepository extends GenericRepository<ISalesModel> implements ISalesRepository {
 
  private _saleModel: Model<ISalesModel>;

  constructor(){
    super(SalesModel);
    this._saleModel = SalesModel;
  }
}