import IPaginationResult from "./IPaginationResult";
import IPaginationParams from "./IPaginationParams";


export default function PaginateData<T>(data:T[], query:IPaginationParams) : IPaginationResult<T>{

  const totalItems = data.length;
  const pageSize = query.pageSize ?? totalItems;
  const currentPage = query.currentPage ?? 1; 
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginate:IPaginationResult<T> = {
    result: data.slice(startIndex, endIndex),
    options: {
      pageSize,
      currentPage,
      totalItems,
      totalPages
    }
  };

  return paginate;
}