import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Controller('health')
class HealthController {
  @Get()
  check(): { status: string; service: string } {
    return { status: 'ok', service: 'dfs-bebidas-api' };
  }
}

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController],
})
export class AppModule {}
