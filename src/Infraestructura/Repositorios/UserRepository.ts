import UserModel from "../../Dominio/Entidades/UserSchema";
import IUserModel from "../../Dominio/Interfaces/IUserModel";
import IUsersRepository from "../Interfaces/IUsersRepository";
import GenericRepository from "../../Utils/GenericRepository/GenericRepository";
import { Model } from 'mongoose';



export default class UserRepository extends GenericRepository<IUserModel> implements IUsersRepository {

  private _userModel: Model<IUserModel>;

  constructor(){
    super(UserModel);
    this._userModel = UserModel;
  }
}