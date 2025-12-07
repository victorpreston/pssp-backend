import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReadinessModule } from './modules/readiness/readiness.module';
import { AiCoachModule } from './modules/ai-coach/ai-coach.module';

@Module({
  imports: [ReadinessModule, AiCoachModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
