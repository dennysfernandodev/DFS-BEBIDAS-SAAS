import { ChatIntent, IntentResult } from './chatbot.types';

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const extractQuantity = (text: string): number | undefined => {
  const match = text.match(/\b(\d{1,3})\b/);
  if (!match) return undefined;
  const quantity = Number(match[1]);
  return quantity > 0 && quantity <= 100 ? quantity : undefined;
};

export class IntentRouter {
  classify(input: string): IntentResult {
    const text = normalize(input);
    const quantity = extractQuantity(text);

    if (!text) return this.result(ChatIntent.UNKNOWN, 0.1);

    if (/\b(atendente|humano|pessoa|falar com alguem|suporte)\b/.test(text)) {
      return this.result(ChatIntent.HUMAN_SUPPORT, 0.99);
    }

    if (/\b(cancelar|cancela|desistir)\b/.test(text)) {
      return this.result(ChatIntent.CANCEL, 0.95);
    }

    if (/\b(onde esta|status|acompanhar|meu pedido|pedido #?[a-z0-9-]+)\b/.test(text)) {
      const code = text.match(/#?([a-z0-9]{4,12})\b/)?.[1];
      return this.result(ChatIntent.ORDER_STATUS, 0.9, { orderCode: code });
    }

    if (/\b(confirmo|confirmar pedido|pode fechar|finalizar|fechar pedido)\b/.test(text)) {
      return this.result(ChatIntent.CONFIRM_ORDER, 0.96);
    }

    if (/\b(pix|dinheiro|cartao|credito|debito|mercado pago)\b/.test(text)) {
      const paymentMethod = text.includes('pix')
        ? 'PIX'
        : text.includes('dinheiro')
          ? 'CASH'
          : text.includes('debito')
            ? 'DEBIT_CARD'
            : text.includes('credito') || text.includes('cartao')
              ? 'CREDIT_CARD'
              : 'MERCADO_PAGO';
      return this.result(ChatIntent.CHOOSE_PAYMENT, 0.94, { paymentMethod });
    }

    if (/\b(meu carrinho|ver carrinho|resumo|quanto deu|total)\b/.test(text)) {
      return this.result(ChatIntent.VIEW_CART, 0.92);
    }

    if (/\b(tirar|remover|excluir)\b/.test(text)) {
      const productQuery = text.replace(/\b(tirar|remover|excluir|do carrinho)\b/g, '').trim();
      return this.result(ChatIntent.REMOVE_ITEM, 0.87, { productQuery, quantity });
    }

    if (/\b(quero|adiciona|adicionar|coloca|manda|vou querer)\b/.test(text)) {
      const productQuery = text
        .replace(/\b(quero|adiciona|adicionar|coloca|manda|vou querer|unidades?|und)\b/g, '')
        .replace(/\b\d{1,3}\b/, '')
        .trim();
      return this.result(ChatIntent.ADD_ITEM, 0.83, { productQuery, quantity: quantity ?? 1 });
    }

    if (/\b(endereco|rua|quadra|qd|qa|setor|bairro|residencial|condominio|lote)\b/.test(text)) {
      return this.result(ChatIntent.INFORM_ADDRESS, 0.78, { address: input.trim() });
    }

    if (/\b(taxa|frete|entrega|quanto para entregar)\b/.test(text)) {
      return this.result(ChatIntent.CALCULATE_DELIVERY, 0.87, { address: input.trim() });
    }

    if (/\b(cardapio|catalogo|menu|produtos|opcoes|o que tem)\b/.test(text)) {
      return this.result(ChatIntent.BROWSE_CATALOG, 0.95);
    }

    if (/\b(tem|vende|preco|valor|quanto custa)\b/.test(text)) {
      const productQuery = text.replace(/\b(tem|vende|preco|valor|quanto custa|de)\b/g, '').trim();
      return this.result(ChatIntent.SEARCH_PRODUCT, 0.8, { productQuery });
    }

    if (/\b(oi|ola|bom dia|boa tarde|boa noite|e ai|opa)\b/.test(text)) {
      return this.result(ChatIntent.GREETING, 0.98);
    }

    return this.result(ChatIntent.UNKNOWN, 0.35);
  }

  private result(
    intent: ChatIntent,
    confidence: number,
    entities: IntentResult['entities'] = {},
  ): IntentResult {
    return { intent, confidence, entities };
  }
}
