import {
  ArgumentsHost,
  Catch,
  ContextType,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { IExceptionResponse } from '~/src/types/error.type';

/*
  TODO: implement error handler for websocket and grpc
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const requestType: ContextType = host.getType();

    switch (requestType) {
      case 'http':
        break;
      case 'ws':
        throw new Error('ws Error');
        break;
      case 'rpc':
        throw new Error('rpc Error');
        break;
      default:
        throw exception;
    }
  }

  private httpExceptionHandler(exception: unknown, host: ArgumentsHost) {
    const httpCTX = host.switchToHttp();
    const request: Request = httpCTX.getRequest();
    const response: Response = httpCTX.getResponse();

    const isHTTPException = exception instanceof HttpException;

    const isQueryFailedError = exception instanceof QueryFailedError;

    const statusCode = isHTTPException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHTTPException ? '' : 'Internal Server Error';

    if (!isHTTPException) {
      this.logger.error(
        `Internal Server Error: ${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(statusCode).json({
      statusCode,
      code: '',
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    } as IExceptionResponse);
  }
}
