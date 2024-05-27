import { UserType } from "../../Dominio/Interfaces/IUserModel";
import SchemaValidator from "../../Utils/Helpers/SchemaValidator";



export default interface SignUpDTO {
  FullName:string;
  Age:number;
  Type: UserType;
  Email: string;
  Password: string;
}

const SignUpDTOSchema = { 
  type: 'object',
  title: 'SignUpDTO',
  description: 'Objeto para hacer signup en la app',
  properties: {
    FullName: { type: 'string' },
    Age: { type: 'number' },
    Type: { 
      type: 'string',
      //enum: ['Seller', 'Client'] 
    },
    Email: { 
      type: 'string',
      format: 'email',
      errorMessage: 'El formato de email no es valido'
    },
    Password: { type: 'string'}
  },
  required: ['FullName', 'Age', 'Type', 'Email', 'Password'],
  additionalProperties: false,
  errorMessage: {
    additionalProperties: 'No deben existir propiedades adicionales'
  }
}

export const validateSignUpDTO = SchemaValidator(SignUpDTOSchema);