import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReadinessModule } from './modules/readiness/readiness.module';
import { AiCoachModule } from './modules/ai-coach/ai-coach.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    ReadinessModule,
    AiCoachModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
