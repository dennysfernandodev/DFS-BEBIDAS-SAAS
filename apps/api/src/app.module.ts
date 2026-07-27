import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';

@Controller('health')
class HealthController {
  @Get()
  check(): { status: string; service: string } {
    return { status: 'ok', service: 'dfs-bebidas-api' };
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AdminModule, ChatbotModule],
  controllers: [HealthController],
})
export class AppModule {}
