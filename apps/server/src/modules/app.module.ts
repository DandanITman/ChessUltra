import { Module } from '@nestjs/common';
import { HealthController } from '../routes/health.controller.js';
import { RulesModule } from './rules.module.js';

@Module({
  imports: [RulesModule],
  controllers: [HealthController],
})
export class AppModule {}

