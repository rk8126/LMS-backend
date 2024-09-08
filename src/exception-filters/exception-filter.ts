// src/common/filters/http-exception.filter.ts
import type { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Safely extract the message property if it exists
      let message = 'An error occurred';
      let stack = '';

      if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message =
          typeof responseObj.message === 'string'
            ? responseObj.message
            : JSON.stringify(responseObj.message);
        stack = typeof responseObj.stack === 'string' ? responseObj.stack : '';
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }

      const errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
        stack,
      };

      this.logger.error(JSON.stringify(errorResponse));

      response.status(status).json(errorResponse);
    } else {
      // Handle unexpected exceptions
      this.logger.error(
        `Unexpected Error: ${exception instanceof Error ? exception.stack : (exception as object).toString()}`
      );

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Internal Server Error',
      });
    }
  }
}
