import { Injectable } from '@nestjs/common';
import { ChatbotGuardrails } from './chatbot-guardrails';
import {
  ChatIntent,
  ChatbotReply,
  ConversationContext,
  ConversationStage,
  IncomingChatMessage,
} from './chatbot.types';
import { IntentRouter } from './intent-router';

@Injectable()
export class ChatbotService {
  private readonly router = new IntentRouter();
  private readonly guardrails = new ChatbotGuardrails();
  private readonly sessions = new Map<string, ConversationContext>();

  async handle(message: IncomingChatMessage): Promise<ChatbotReply> {
    const text = this.guardrails.assertMessage(message.text);
    const context = this.getOrCreateContext(message);

    if (context.lastMessageId === message.messageId) {
      return {
        text: 'Mensagem já processada.',
        stage: context.stage,
        intent: context.lastIntent ?? ChatIntent.UNKNOWN,
        requiresHuman: context.humanRequested,
        actions: [],
      };
    }

    const result = this.router.classify(text);
    context.lastIntent = result.intent;
    context.lastMessageId = message.messageId;
    context.updatedAt = new Date();

    switch (result.intent) {
      case ChatIntent.GREETING:
        context.stage = ConversationStage.DISCOVERY;
        return this.reply(context, result.intent, 'Olá! Posso mostrar o cardápio, procurar um produto ou calcular a taxa de entrega.');

      case ChatIntent.BROWSE_CATALOG:
        context.stage = ConversationStage.DISCOVERY;
        return this.reply(context, result.intent, 'Vou abrir as categorias disponíveis.', [
          { type: 'SHOW_CATALOG' },
        ]);

      case ChatIntent.SEARCH_PRODUCT:
      case ChatIntent.ADD_ITEM:
        context.stage = ConversationStage.BUILDING_CART;
        return this.reply(
          context,
          result.intent,
          'Vou consultar o catálogo atualizado antes de informar disponibilidade e preço.',
          [{ type: 'SEARCH_CATALOG', query: result.entities.productQuery ?? text }],
        );

      case ChatIntent.REMOVE_ITEM:
      case ChatIntent.VIEW_CART:
        context.stage = ConversationStage.BUILDING_CART;
        return this.reply(context, result.intent, 'Vou conferir o carrinho.', [{ type: 'SHOW_CART' }]);

      case ChatIntent.INFORM_ADDRESS:
      case ChatIntent.CALCULATE_DELIVERY:
        context.stage = ConversationStage.WAITING_ADDRESS;
        context.deliveryAddress = result.entities.address ?? text;
        return this.reply(
          context,
          result.intent,
          'Vou validar o endereço e consultar a taxa correta da região.',
          [{ type: 'CALCULATE_DELIVERY', address: context.deliveryAddress }],
        );

      case ChatIntent.CHOOSE_PAYMENT:
        context.paymentMethod = result.entities.paymentMethod;
        context.stage = ConversationStage.WAITING_CONFIRMATION;
        return this.reply(context, result.intent, 'Forma de pagamento registrada. Vou preparar o resumo para confirmação.', [
          { type: 'SHOW_CART' },
        ]);

      case ChatIntent.CONFIRM_ORDER:
        try {
          this.guardrails.assertCanConfirm(context);
          context.stage = ConversationStage.ORDER_CREATED;
          return this.reply(context, result.intent, 'Pedido pronto para criação e confirmação pelo sistema.', [
            { type: 'CREATE_ORDER' },
          ]);
        } catch (error) {
          return this.reply(context, result.intent, this.confirmationRequirementMessage(error));
        }

      case ChatIntent.ORDER_STATUS:
        return this.reply(context, result.intent, 'Vou consultar o andamento do pedido.', [
          { type: 'CHECK_ORDER', code: result.entities.orderCode ?? context.activeOrderCode },
        ]);

      case ChatIntent.HUMAN_SUPPORT:
        context.humanRequested = true;
        context.stage = ConversationStage.HUMAN_HANDOFF;
        return this.reply(context, result.intent, 'Certo. O atendimento será encaminhado para uma pessoa da equipe.', [
          { type: 'HANDOFF', reason: 'Solicitação explícita do cliente' },
        ], true);

      case ChatIntent.CANCEL:
        return this.reply(context, result.intent, 'Vou encaminhar a solicitação de cancelamento para validação.', [
          { type: 'HANDOFF', reason: 'Cancelamento exige validação operacional' },
        ], true);

      default:
        return this.reply(
          context,
          result.intent,
          'Não consegui identificar com segurança. Você pode pedir o cardápio, informar o produto, mandar o endereço ou falar com um atendente.',
        );
    }
  }

  private getOrCreateContext(message: IncomingChatMessage): ConversationContext {
    const key = `${message.tenantId}:${message.storeId}:${message.customerPhone}`;
    const existing = this.sessions.get(key);
    if (existing) return existing;

    const created: ConversationContext = {
      id: key,
      tenantId: message.tenantId,
      storeId: message.storeId,
      customerPhone: message.customerPhone,
      customerName: message.customerName,
      stage: ConversationStage.START,
      cart: [],
      humanRequested: false,
      updatedAt: new Date(),
    };
    this.sessions.set(key, created);
    return created;
  }

  private reply(
    context: ConversationContext,
    intent: ChatIntent,
    text: string,
    actions: ChatbotReply['actions'] = [],
    requiresHuman = false,
  ): ChatbotReply {
    return { text, stage: context.stage, intent, requiresHuman, actions };
  }

  private confirmationRequirementMessage(error: unknown): string {
    const code = error instanceof Error ? error.message : 'UNKNOWN';
    const messages: Record<string, string> = {
      EMPTY_CART: 'Antes de confirmar, precisamos adicionar pelo menos um item ao carrinho.',
      ADDRESS_REQUIRED: 'Antes de confirmar, preciso do endereço de entrega.',
      DELIVERY_QUOTE_REQUIRED: 'Antes de confirmar, preciso calcular a taxa de entrega.',
      PAYMENT_REQUIRED: 'Antes de confirmar, preciso saber a forma de pagamento.',
    };
    return messages[code] ?? 'Não foi possível confirmar com segurança. Vou revisar os dados do pedido.';
  }
}
