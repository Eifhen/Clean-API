
import { Request } from 'express';

export default function getRequestID(req: Request){
  return `${req.requestID}`;
}