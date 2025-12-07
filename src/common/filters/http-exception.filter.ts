import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface HttpExceptionResponse {
  message: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * Global HTTP exception filter.
 * Formats all exceptions into consistent JSON error responses.
 */

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : this.extractMessage(exceptionResponse as HttpExceptionResponse);

    response.status(status).json({
      success: false,
      error: {
        code: status,
        message,
        details:
          typeof exceptionResponse === 'object' ? exceptionResponse : undefined,
      },
      timestamp: new Date().toISOString(),
    });
  }

  private extractMessage(response: HttpExceptionResponse): string | string[] {
    return response.message || 'Internal server error';
  }
}
