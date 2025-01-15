import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);

  private readonly prismaErrorCodes = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };

  private defaultExceptionMessage(exception: Prisma.PrismaClientKnownRequestError): string {
    const shortMessage = exception.message.slice(Math.max(0, exception.message.indexOf('→')));
    return `[${exception.code}]: ` + shortMessage.slice(Math.max(0, shortMessage.indexOf('\n'))).replaceAll('\n', '').trim();
  }

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    this.logger.error(exception.message);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = this.defaultExceptionMessage(exception);

    const exceptionCode = exception.code;

    const statusCode = Object.keys(this.prismaErrorCodes).includes(exceptionCode)
      ? this.prismaErrorCodes[exceptionCode as keyof typeof this.prismaErrorCodes]
      : HttpStatus.INTERNAL_SERVER_ERROR;

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
