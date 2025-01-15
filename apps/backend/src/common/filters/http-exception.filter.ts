import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger, ValidationError } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();

    const errorResponse = exception.getResponse();
    let validationErrorMessages = '';

    if (statusCode === HttpStatus.BAD_REQUEST && typeof errorResponse === 'object' && 'message' in errorResponse) {
      // バリデーションエラーの場合、ログを出力
      const validationErrors = this.formatValidationErrors(Array.isArray(errorResponse.message) ? errorResponse.message : [errorResponse.message]);
      validationErrorMessages = JSON.stringify(validationErrors);
      this.logger.error(`Validation failed for [${request.method}] ${request.url}`);
      this.logger.verbose(`[Request] ${JSON.stringify(request.body)} [ErrorMessages] ${validationErrorMessages}`);
    }

    response
      .status(statusCode)
      .json({
        statusCode,
        message: validationErrorMessages,
        timestamp: new Date().toLocaleString('ja-JP'),
        path: request.url,
      });
  }

  private formatValidationErrors(errors: ValidationError[]): any[] {
    return errors.map((error) => {
      if (typeof error === 'string') {
        return error;
      }

      if (typeof error === 'object' && error.constraints) {
        return {
          property: error.property,
          message: error.constraints,
        };
      }

      return error;
    });
  }
}
