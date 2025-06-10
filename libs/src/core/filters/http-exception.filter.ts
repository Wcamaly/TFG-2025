import { CORRELATION_ID_HEADER } from "@core/middleware/correlation-id.middleware";

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

import { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const correlationId = response.getHeader(CORRELATION_ID_HEADER);

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = (exception as any)?.message;
    const originalError = (exception as any)?.response?.originalError;

    const responseBody = {
      statusCode: httpStatus,
      message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      errors: (exception as any)?.response?.errors,
    };

    this.logger.error({
      error: responseBody,
      originalError: originalError
        ? {
            message: (exception as any)?.response?.originalError?.message,
            stackTrace: originalError.stack,
          }
        : undefined,
      correlationId,
      stackTrace: (exception as any)?.stack,
    });

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
