
import IUserModel from "../../Dominio/Interfaces/IUserModel";
import IGenericRepository from "../../Utils/GenericRepository/IGenericRepository";



export default interface IUsersRepository extends IGenericRepository<IUserModel> {
  
}