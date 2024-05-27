import SchemaValidator from "../Helpers/SchemaValidator";





export default interface IPaginationParams {
  //skip: number;
  pageSize: number;    // tamaño de las páginas
  currentPage: number; // la página actual me va a decir cuantas páginas tengo que hacer skip
  totalPages?: number; // número total de páginas es igual al total de registros / total de páginas 
  totalItems?: number; // Sirve para saber el número total de elementos
}


const PaginationParamsSchema = {
  type: "object",
  title: "PaginationParamsSchema",
  description: "Esquema para el objeto PaginationParams",
  properties: {
    pageSize: {
      type: "number"
    },
    currentPage: {
      type: "number",
    },
    totalPages: {
      type: "number"
    },
    totalItems: {
      type: "number"
    }
  },
  required: ['currentPage', 'pageSize'],
  additionalProperties: false,
  errorMessage: {
    additionalProperties: "No deben existir propiedades adicionales"
  }
}

export const ValidatePaginationParams = SchemaValidator(PaginationParamsSchema);