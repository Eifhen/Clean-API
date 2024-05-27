import ShoesModel from "../../Dominio/Entidades/ShoesSchema";
import IShoesModel from "../../Dominio/Interfaces/IShoesModel";
import IShoesRepository from "../Interfaces/IShoesRepository";
import GenericRepository from "../../Utils/GenericRepository/GenericRepository";
import { Model } from 'mongoose';



export default class ShoesRepository extends GenericRepository<IShoesModel> implements IShoesRepository {

  private _shoeModel: Model<IShoesModel>;

  constructor(){
    super(ShoesModel);
    this._shoeModel = ShoesModel;
  }

  // Métodos de ShoesRepository


}