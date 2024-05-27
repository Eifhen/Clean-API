import IUserModel from "../../Dominio/Interfaces/IUserModel";
import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import IOperationResult from "../../Utils/OperationResult/IOperationResult";
import SignInDTO from "../DTOs/SignInDTO";
import SignUpDTO from "../DTOs/SignUpDTO";
import ISignUpServiceDTO from "../DTOs/SignUpServiceDTO";





export default interface IAuthenticationService {
  SignIn(args: IOperationArgs<SignInDTO>): Promise<IOperationResult<string>>;
  SignUp(args: IOperationArgs<ISignUpServiceDTO>): Promise<IOperationResult<IUserModel>>;
}