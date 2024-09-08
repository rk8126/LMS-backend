import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';

@Controller()
export class AppController {
  public constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator
  ) {}

  @Get('/health')
  @HealthCheck()
  public getHello(): { message: string } {
    return { message: 'Server is running on 3000' };
  }
}
