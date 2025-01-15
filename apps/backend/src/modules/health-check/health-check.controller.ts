import { Controller, Get, Logger } from '@nestjs/common';

@Controller('/api/health-check')
export class HealthCheckController {
  private readonly logger = new Logger(HealthCheckController.name);

  constructor() {}

  @Get()
  healthCheck() {
    this.logger.log('Healthy😉');
    return;
  }
}
