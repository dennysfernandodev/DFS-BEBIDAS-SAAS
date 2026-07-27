import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { IncomingChatMessage } from './chatbot.types';

interface ProcessMessageBody {
  tenantId: string;
  storeId: string;
  customerPhone: string;
  customerName?: string;
  channel?: 'WHATSAPP' | 'WEBCHAT' | 'ADMIN';
  messageId: string;
  text: string;
  receivedAt?: string;
}

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('messages')
  @HttpCode(200)
  async process(@Body() body: ProcessMessageBody) {
    const message: IncomingChatMessage = {
      tenantId: body.tenantId,
      storeId: body.storeId,
      customerPhone: body.customerPhone,
      customerName: body.customerName,
      channel: body.channel ?? 'WHATSAPP',
      messageId: body.messageId,
      text: body.text,
      receivedAt: body.receivedAt ? new Date(body.receivedAt) : new Date(),
    };

    return this.chatbotService.handle(message);
  }
}
