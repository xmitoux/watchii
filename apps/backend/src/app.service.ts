import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is Watchii Backend!';
  }
}
