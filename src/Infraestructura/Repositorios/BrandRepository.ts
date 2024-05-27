import { logger } from "../../API/Configuration/logger.config";
import BrandModel from "../../Dominio/Entidades/BrandSchema";
import IBrandModel from "../../Dominio/Interfaces/IBrandModel";
import IBrandRepository from "../Interfaces/IBrandRepository";
import GenericRepository from "../../Utils/GenericRepository/GenericRepository";
import { Model } from 'mongoose';




export default class BrandRepository extends GenericRepository<IBrandModel> implements IBrandRepository {

  private _brandModel: Model<IBrandModel>;

  constructor(){
    super(BrandModel);
    this._brandModel = BrandModel;
  }


}