import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHome() {
    return {
      status: 'online',
      message: 'Portfolio Backend API is running successfully!',
      health: '/api/health',
      documentation: 'All API endpoints are available under /api/*',
    };
  }
}
