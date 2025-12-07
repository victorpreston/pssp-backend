import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReadinessModule } from './readiness/readiness.module';
import { AiCoachModule } from './ai-coach/ai-coach.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [ReadinessModule, AiCoachModule, GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
