import { Module } from '@nestjs/common';
import { RulesController } from '../routes/rules.controller.js';

@Module({
  controllers: [RulesController],
})
export class RulesModule {}

