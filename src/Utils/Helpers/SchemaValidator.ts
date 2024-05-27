import Ajv from "ajv";
import addFormats from 'ajv-formats';
import addErros from 'ajv-errors';

interface SchemaStatus {
  isValid: boolean;
  errors: any;
}

const ajv = new Ajv({allErrors: true});
addFormats(ajv);
addErros(ajv);

export default function SchemaValidator(schema: object){

  const validate = ajv.compile(schema);

  const validator = (data: any) : SchemaStatus => {
    const valid = validate(data);
    return {
      isValid: valid ? true : false,
      errors: ajv.errorsText(validate.errors),
    }
  }

  return validator;
}