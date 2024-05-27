import mongoose from "mongoose";
import SchemaValidator from "../../Utils/Helpers/SchemaValidator";


export default interface BrandDTO {
  name: string;
  country: string;
  id?: string | mongoose.Types.ObjectId;
}

const BrandDTOSchema = {
  type: "object",
  title: "BrandDTOSchema",
  description: "Esquema para el BrandDTO",
  properties: {
    name: { type: "string"},
    country: { type: "string" },
    id: { type: "string" }
  },
  required: ["name","country"],
  additionalProperties: false,
  errorMessage: {
    additionalProperties: "No deben existir propiedades adicionales"
  }
}

export const validateBrandDTO = SchemaValidator(BrandDTOSchema);