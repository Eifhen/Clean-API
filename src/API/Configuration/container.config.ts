import { AwilixContainer, createContainer, asClass, asValue, InjectionMode, asFunction } from "awilix";
import IConfiguration, { Environment, EnvironmentStates } from "../Interfaces/IConfigurations";
import Configuration from "./configurations";
import ApiKeyManager from "./api_key.config";
import IAuthenticationService from "../../Aplicacion/Interfaces/IAuthenticationService";
import AuthenticationService from "../../Aplicacion/Servicios/AuthenticationService";
import ErrorHandler from "./error.handler.config";
import IApiKeyManager from "../Interfaces/IApiKeyManager";
import IBrandRepository from "../../Infraestructura/Interfaces/IBrandRepository";
import { scopePerRequest } from "awilix-express";
import { Application } from "express";
import IUserService from "../../Aplicacion/Interfaces/IUserServce";
import UserService from "../../Aplicacion/Servicios/UserService";
import ISalesDetailRepository from "../../Infraestructura/Interfaces/ISaleDetailRepository";
import ISalesRepository from "../../Infraestructura/Interfaces/ISalesRepository";
import IShoesRepository from "../../Infraestructura/Interfaces/IShoesRepository";
import IUsersRepository from "../../Infraestructura/Interfaces/IUsersRepository";
import BrandRepository from "../../Infraestructura/Repositorios/BrandRepository";
import SalesDetailRepository from "../../Infraestructura/Repositorios/SalesDetailRepository";
import SalesRepository from "../../Infraestructura/Repositorios/SalesRepository";
import ShoesRepository from "../../Infraestructura/Repositorios/ShoesRepository";
import UserRepository from "../../Infraestructura/Repositorios/UserRepository";
import ErrorManager from "../../Utils/ErrorManager/ErrorManager";
import TransactionManager from "../../Utils/TransactionManager/TransactionManager";
import IErrorManager from "../../Utils/ErrorManager/IErrorManager";
import ILoggerManager from "../../Utils/Loggs/ILoggerManager";
import ITransactionManager from "../../Utils/TransactionManager/ITransactionManager";
import LoggerManager from "../../Utils/Loggs/LoggerManager";
import DatabaseManager from "./database.config";
import { IDatabaseManager } from "../Interfaces/IDatabaseManager";
import ITokenManager from "../../Utils/TokenManager/ITokenManager";
import TokenManager from "../../Utils/TokenManager/TokenManager";
import IEncrypterManager from "../../Utils/EncrypterManager/IEncrypterManager";
import EncrypterManager from "../../Utils/EncrypterManager/EncrypterManager";
import IBrandService from "../../Aplicacion/Interfaces/IBrandService";
import BrandService from "../../Aplicacion/Servicios/BrandService";
import SalesService from "../../Aplicacion/Servicios/SalesService";
import ISalesService from "../../Aplicacion/Interfaces/ISalesService";
import ISalesDetailService from "../../Aplicacion/Interfaces/ISalesDetailService";
import SalesDetailService from "../../Aplicacion/Servicios/SalesDetailService";
import ShoesService from "../../Aplicacion/Servicios/ShoesService";
import IShoesService from "../../Aplicacion/Interfaces/IShoesService";
import IFileManager from "../../Utils/FileManager/IFileManager";
import FileManager from "../../Utils/FileManager/FileManager";

export default function DependencyManager(app:Application, environment:Environment){
  const container = createContainer({
    injectionMode: InjectionMode.PROXY,
    strict: true
  });

  container.register({
    
    // Repositories
    brandRepository: asClass<IBrandRepository>(BrandRepository).scoped(),
    salesRepository: asClass<ISalesRepository>(SalesRepository).scoped(),
    salesDetailRepository: asClass<ISalesDetailRepository>(SalesDetailRepository).scoped(),
    shoesRepository: asClass<IShoesRepository>(ShoesRepository).scoped(),
    userRepository: asClass<IUsersRepository>(UserRepository).scoped(),

    // Services
    userService: asClass<IUserService>(UserService).scoped(),
    brandService: asClass<IBrandService>(BrandService).scoped(),
    authenticationService: asClass<IAuthenticationService>(AuthenticationService).scoped(),
    salesService: asClass<ISalesService>(SalesService).scoped(),
    salesDetailService: asClass<ISalesDetailService>(SalesDetailService).scoped(),
    shoesService: asClass<IShoesService>(ShoesService).scoped(),

    // Helpers
    transactionManager: asClass<ITransactionManager>(TransactionManager).scoped(),
    loggerManager: asClass<ILoggerManager>(LoggerManager).scoped(),
    errorManager: asClass<IErrorManager>(ErrorManager).scoped(),
    configuration: asClass<IConfiguration>(Configuration).scoped(),
    databaseManager: asClass<IDatabaseManager>(DatabaseManager).scoped(),
    tokenManager: asClass<ITokenManager>(TokenManager).scoped(),
    encrypterManager: asClass<IEncrypterManager>(EncrypterManager).scoped(),
    fileManager: asClass<IFileManager>(FileManager).scoped(),

    // Middlewares
    errorHandler: asClass<ErrorHandler>(ErrorHandler).scoped(),
    apiKeyManager: asClass<IApiKeyManager>(ApiKeyManager),


    // Values
    env: asValue<Environment>(environment),

  });

  app.use(scopePerRequest(container));

  return container;
}