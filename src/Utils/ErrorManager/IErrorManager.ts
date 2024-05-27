import { CodigoHTTP, MensajeHTTP } from '../Enums/codigosHttp';
import ExceptionError, { IExceptionError } from './ExceptionError';


export default interface IErrorManager {

  getException(error: ExceptionError, withStack?:boolean): ExceptionError;

}