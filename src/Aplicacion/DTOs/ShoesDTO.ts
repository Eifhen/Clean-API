import mongoose from "mongoose";
import SchemaValidator from "../../Utils/Helpers/SchemaValidator";

export default interface ShoesDTO {
  name: string;
  size: number;
  color: string;
  stock: number;
  brand: mongoose.Schema.Types.ObjectId | string;
  price: number;
  id?: mongoose.Schema.Types.ObjectId | string;
}

const ShoesDTOSchema = {
  type: "object",
  title: "ShoesDTOSchema",
  description: "Esquema para el objeto ShoesDTO",
  properties: {
    name: { type: "string" },
    size: { type: "number" },
    color: { type: "string" },
    stock: { type: "number" },
    brand: { type: "string" },
    price: { type: "number"},
    id: { type: "string" }
  },
  additionalProperties: false,
  required: ['name', 'size', 'color', 'stock', 'brand', 'price'],
  errorMessage: {
    additionalProperties: "No deben existir propiedades adicionales"
  }
}

export const ValidateShoesDTO = SchemaValidator(ShoesDTOSchema);