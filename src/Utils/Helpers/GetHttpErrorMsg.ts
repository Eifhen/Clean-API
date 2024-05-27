import { CodigoHTTP, MensajeHTTP } from "../Enums/codigosHttp";

export function GetHttpErrorMsg(codigo: number): string {
  switch (codigo) {
      case CodigoHTTP.BadRequest:
          return MensajeHTTP.BadRequest;
      case CodigoHTTP.Unauthorized:
          return MensajeHTTP.Unauthorized;
      case CodigoHTTP.Forbidden:
          return MensajeHTTP.Forbidden;
      case CodigoHTTP.NotFound:
          return MensajeHTTP.NotFound;
      case CodigoHTTP.MethodNotAllowed:
          return MensajeHTTP.MethodNotAllowed;
      case CodigoHTTP.UnprocessableEntity:
          return MensajeHTTP.UnprocessableEntity;
      case CodigoHTTP.InternalServerError:
          return MensajeHTTP.InternalServerError;
      case CodigoHTTP.NotImplemented:
          return MensajeHTTP.NotImplemented;
      case CodigoHTTP.BadGateway:
          return MensajeHTTP.BadGateway;
      case CodigoHTTP.ServiceUnavailable:
          return MensajeHTTP.ServiceUnavailable;
      default:
          return 'Ha ocurrido un error.';
  }
}