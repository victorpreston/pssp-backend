import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      success: true,
      data: {
        status: 'healthy',
        service: 'Post-School Success Platform API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
      },
      timestamp: new Date().toISOString(),
    };
  }
}
