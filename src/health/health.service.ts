import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  getHealth() {
    return {
      status: 'ok',
      service: 'portfolio-api',
      environment: this.configService.get<string>('NODE_ENV') || 'development',
    };
  }
}
