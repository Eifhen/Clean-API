import mongoose from "mongoose";
import SchemaValidator from "../../Utils/Helpers/SchemaValidator";



export default interface SalesDTO {
  id?: mongoose.Types.ObjectId,
  total: number;
  client: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  date: Date;
}

const SalesSchema = {
  type: "object",
  title: "SalesSchema",
  description: "Esquema para el modelo de ventas",
  properties: {
    id: {
      type: "string",
    },
    total: {
      type: "number"
    },
    client: {
      type: "string"
    },
    seller: {
      type: "string"
    },
    date: {
      type: "string",
      format: 'date-time'
    }
  },
  required: ['total', 'client', 'seller', 'date'],
  additionalProperties: false,
  errorMessage: {
    additionalProperties: "No deben existir propiedades adicionales"
  }
}

export const ValidateSalesDTO = SchemaValidator(SalesSchema);