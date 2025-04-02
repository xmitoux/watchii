import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import * as express from 'express';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import { PrismaClientValidationFilter } from './common/filters/prisma-validation-exception.filter';
import { ApiKeyGuard } from './common/guard/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = app.get(Logger);
  app.useLogger(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaClientValidationFilter());
  app.useGlobalGuards(new ApiKeyGuard());

  // リクエストボディのサイズ制限を10MBに設定
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // タイムアウト時間を長めに設定(Post登録APIに上げる枚数が多いとタイムアウトするため)
  const server = app.getHttpServer();
  server.setTimeout(30000);

  const port = process.env.PORT ?? 3001;

  await app.listen(port, () => {
    logger.log(`Server listening on port:${port} NODE_ENV=${process.env.NODE_ENV}`);
  });
}

bootstrap();
