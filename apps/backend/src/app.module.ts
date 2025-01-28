import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { PostsModule } from './modules/posts/posts.module';
import { EpisodesModule } from './modules/episodes/episodes.module';

const pinoHttp = {
  level: process.env.PINO_LOG_LEVEL || 'trace',
  transport: {
    options: {
      singleLine: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
    },
    target: 'pino-pretty',
  },
};

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot({ pinoHttp }),
    PostsModule,
    HealthCheckModule,
    EpisodesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
