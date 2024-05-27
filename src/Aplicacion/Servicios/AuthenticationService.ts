import { MensajeHTTP, CodigoHTTP } from "../../Utils/Enums/codigosHttp";
import ExceptionError from "../../Utils/ErrorManager/ExceptionError";
import OperationResult from "../../Utils/OperationResult/OperationResult";
import IOperationResult from "../../Utils/OperationResult/IOperationResult";
import SignInDTO, { validateSignInDTO } from "../DTOs/SignInDTO";
import SignUpDTO, { validateSignUpDTO } from "../DTOs/SignUpDTO";
import IAuthenticationService from "../Interfaces/IAuthenticationService";
import ITokenManager from "../../Utils/TokenManager/ITokenManager";
import IUsersRepository from "../../Infraestructura/Interfaces/IUsersRepository";
import IUserModel from "../../Dominio/Interfaces/IUserModel";
import ITransactionManager from "../../Utils/TransactionManager/ITransactionManager";
import UserModel from "../../Dominio/Entidades/UserSchema";
import IEncrypterManager from "../../Utils/EncrypterManager/IEncrypterManager";
import { activityLog } from "../../API/Configuration/logger.config";
import IOperationArgs from "../../Utils/OperationArgs/IOperationArgs";
import ISignUpServiceDTO from "../DTOs/SignUpServiceDTO";


interface AuthenticationServiceDependencys {
  tokenManager: ITokenManager;
  userRepository: IUsersRepository;
  transactionManager: ITransactionManager;
  encrypterManager: IEncrypterManager;
}

export default class AuthenticationService implements IAuthenticationService {

  private readonly tokenManager: ITokenManager;
  private readonly userRepository: IUsersRepository;
  private readonly transactionManager: ITransactionManager;
  private readonly encrypterManager: IEncrypterManager;

  constructor(deps: AuthenticationServiceDependencys){
    this.tokenManager = deps.tokenManager;
    this.userRepository = deps.userRepository;
    this.transactionManager = deps.transactionManager;
    this.encrypterManager = deps.encrypterManager;
  }

  // Login
  public SignIn = async (args: IOperationArgs<SignInDTO>) : Promise<IOperationResult<string>> => {
    try {
      activityLog("service", "AuthenticationService", "SignIn", args.requestID);

      const data = args.data;
      const { isValid, errors } = validateSignInDTO(data);
      if(!isValid){
        throw new Error(errors);
      }
      
      const find = await this.userRepository.find({
        Email: data.email, 
      });

      if(!find){
        throw new Error("No existe un usuario con este email");  
      }

      const passwordIsValid = await this.encrypterManager.ComparePassword(data.password, find.Password);

      if(!passwordIsValid){
        throw new Error("La contraseña es incorrecta");
      }

      const token = await this.tokenManager.Generate(find);
      return new OperationResult<string>(token, MensajeHTTP.OK);
    }
    catch(err: any){
      throw new ExceptionError(
        CodigoHTTP.InternalServerError, 
        err.message,
        __filename,
      );
    }
  }

  // Registro
  public SignUp = async (args: IOperationArgs<ISignUpServiceDTO>): Promise<IOperationResult<IUserModel>> => {
    
    activityLog("service", "AuthenticationService", "SignUp", args.requestID);
    const session = await this.transactionManager.StartSession();

    try {
      const data = args.data.signUpData;
      const { isValid, errors } = validateSignUpDTO(data);
      if(!isValid){
        throw new Error(errors);
      }

      const password = await this.encrypterManager.Encrypt(data.Password);

      const user = new UserModel({
        FullName: data.FullName,
        Age: data.Age,
        RegisterDate: new Date(),
        IP_Address: args.data.ip_address,
        Type:  data.Type,
        Email: data.Email,
        Password: password,
      })

      const result:IUserModel = await this.userRepository.create(user, session);
      await this.transactionManager.Commit();
      return new OperationResult<IUserModel>(result, MensajeHTTP.OK);
    }
    catch(err: any){
      await this.transactionManager.RollBack();
      throw new ExceptionError(
        CodigoHTTP.InternalServerError, 
        err.message,
        __filename,
      );
    }
  }
}