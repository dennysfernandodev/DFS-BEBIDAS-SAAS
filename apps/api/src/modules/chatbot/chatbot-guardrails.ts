import { ChatbotReply, ConversationContext, ConversationStage } from './chatbot.types';

export interface GroundedProduct {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

export interface GroundedDeliveryQuote {
  zoneName: string;
  fee: number;
  estimatedMinutes: number;
}

export class ChatbotGuardrails {
  assertMessage(input: string): string {
    const text = input.trim();
    if (!text) throw new Error('EMPTY_MESSAGE');
    if (text.length > 2_000) throw new Error('MESSAGE_TOO_LONG');
    return text;
  }

  assertProduct(product: GroundedProduct | null): GroundedProduct {
    if (!product || !product.active) throw new Error('PRODUCT_NOT_AVAILABLE');
    if (!Number.isFinite(product.price) || product.price < 0) throw new Error('INVALID_PRODUCT_PRICE');
    return product;
  }

  assertDeliveryQuote(quote: GroundedDeliveryQuote | null): GroundedDeliveryQuote {
    if (!quote) throw new Error('DELIVERY_ZONE_NOT_FOUND');
    if (!Number.isFinite(quote.fee) || quote.fee < 0) throw new Error('INVALID_DELIVERY_FEE');
    return quote;
  }

  assertCanConfirm(context: ConversationContext): void {
    if (context.cart.length === 0) throw new Error('EMPTY_CART');
    if (!context.deliveryAddress) throw new Error('ADDRESS_REQUIRED');
    if (context.deliveryFee === undefined) throw new Error('DELIVERY_QUOTE_REQUIRED');
    if (!context.paymentMethod) throw new Error('PAYMENT_REQUIRED');
  }

  safeFailure(message: string, context: ConversationContext): ChatbotReply {
    return {
      text: message,
      stage: context.stage ?? ConversationStage.START,
      intent: context.lastIntent!,
      requiresHuman: false,
      actions: [],
    };
  }
}
