import { HttpStatus } from '@nestjs/common';

export interface IExceptionResponse {
  statusCode: HttpStatus;
  code: string;
  message: string | string[];
  path: string;
  timestamp: Date | string;
}

export enum EErrorCode {}
