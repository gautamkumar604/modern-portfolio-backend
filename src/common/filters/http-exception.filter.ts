import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isProduction = process.env.NODE_ENV === 'production';

    let errorBody: Record<string, any> = {};

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        errorBody = res as Record<string, any>;
      } else {
        errorBody = { message: res };
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `Unhandled error processing ${request.method} ${request.url}: ${exception.message}`,
        exception.stack,
      );
      errorBody = {
        message: isProduction
          ? 'Internal server error'
          : exception.message || 'Internal server error',
      };
    } else {
      this.logger.error(
        `Unhandled exception on ${request.method} ${request.url}`,
      );
      errorBody = { message: 'Internal server error' };
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...errorBody,
    });
  }
}
