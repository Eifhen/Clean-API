import { UserType } from "../../Dominio/Interfaces/IUserModel";
import SchemaValidator from "../../Utils/Helpers/SchemaValidator";



export default interface UserDTO {
  fullName: string;
  age: number;
  registerDate: Date;
  email: string;
  password?: string;
  type: UserType;
  id: string;
  ip_address?: string;
}

const UserDTOSchema = {
  type: "object",
  title: "UserDTOSchema",
  description: "Esquema para el UserDTO",
  properties: {
    id: { type: "string"},
    fullName: { type: "string" },
    age: { type: "number"},
    type: {type: "string"},
    password: {type: "string"},
    registerDate: { 
      type: "string",
      format: 'date-time'
    },
    ip_address: { type: "string"},
    email: { 
      type: "string",
      format: "email",
      errorMessage: "El formato de email no es valido"
    }
  },
  required: ['fullName','age', 'type', 'email', 'registerDate'],
  additionalProperties: false,
  errorMessage: {
    additionalProperties: "No deben existir propiedades adicionales"
  }
}

export const validateUserDTO = SchemaValidator(UserDTOSchema);