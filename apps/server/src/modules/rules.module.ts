import { Module } from '@nestjs/common';
import { RulesController } from '../routes/rules.controller.js';
import { BotController } from '../routes/bot.controller.js';

@Module({
  controllers: [RulesController, BotController],
})
export class RulesModule {}

