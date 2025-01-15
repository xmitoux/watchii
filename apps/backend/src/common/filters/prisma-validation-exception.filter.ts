import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

// prisma.model.createなどで不正な値を登録しようとしたときの例外を処理するフィルタ
@Catch(Prisma.PrismaClientValidationError)
export class PrismaClientValidationFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaClientValidationFilter.name);

  catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    this.logger.error(exception.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message;
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    response
      .status(statusCode)
      .json({
        message,
        statusCode,
        timestamp: new Date().toLocaleString('ja-JP'),
        path: request.url,
      });
  }
}
