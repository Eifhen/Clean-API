import mongoose from "mongoose";
import SchemaValidator from "../../Utils/Helpers/SchemaValidator"

export default interface SalesDetailDTO {
  id?:   mongoose.Types.ObjectId | string;
  sale:  mongoose.Types.ObjectId | string;
  shoe:  mongoose.Types.ObjectId | string;
  price: number;
}

const SalesDetailDTOSchema = {
  type: "object",
  title: "SalesDetailDTOSchema",
  description: "Schema para el DTO SalesDetail",
  properties: {
    id: { type : "string" },
    sale: { type: "string" },
    shoe: { type: "string" },
    price: { type: "number" } 
  },
  additionalProperties: false,
  required: ['sale', 'shoe', 'price'],
  errorMessage: {
    additionalProperties: "El objeto no debe contener propiedades adicionales"
  }
}

export const ValidateSalesDetailDTOSchema = SchemaValidator(SalesDetailDTOSchema);


