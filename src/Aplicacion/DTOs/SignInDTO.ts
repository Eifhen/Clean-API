import SchemaValidator from "../../Utils/Helpers/SchemaValidator";

export default interface SignInDTO {
  email: string;
  password: string;
}

const SignInSchema = {
  type: "object",
  title: "SignInSchema",
  description: "Objeto para iniciar sesion",
  properties: {
    email: { 
      type: 'string',
      format: 'email',
      errorMessage: 'El formato de email es invalido',
    },
    password: { type: 'string' }
  },
  required: ['email', 'password'],
  additionalProperties: false,
  errorMessage: {
    additionalProperties: 'No deben existir propiedades adicionales'
  }
}

export const validateSignInDTO = SchemaValidator(SignInSchema);