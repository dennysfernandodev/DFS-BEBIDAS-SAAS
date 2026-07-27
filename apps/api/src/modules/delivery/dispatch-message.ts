export interface DispatchMessageInput {
  orderCode: string;
  storeName: string;
  storeAddress: string;
  customerNeighborhood: string;
  customerAddress: string;
  customerReference?: string | null;
  deliveryFee?: string | null;
  paymentMethod: string;
  pickupDeadlineMinutes: number;
  deliveryTargetMinutes: number;
  acceptanceCode: string;
}

function clean(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
}

/**
 * Não publica telefone do cliente, observações pessoais ou dados de pagamento
 * sensíveis no grupo. O endereço é necessário para avaliação da corrida.
 */
export function buildDispatchMessage(input: DispatchMessageInput): string {
  const reference = input.customerReference
    ? `\n📍 Referência: ${clean(input.customerReference)}`
    : '';

  const fee = input.deliveryFee
    ? `\n💰 Taxa da entrega: ${clean(input.deliveryFee)}`
    : '';

  return [
    '🛵 *NOVA ENTREGA DISPONÍVEL*',
    '',
    `📦 Pedido: *${clean(input.orderCode)}*`,
    `🏪 Retirada: *${clean(input.storeName)}*`,
    `📍 Comércio: ${clean(input.storeAddress)}`,
    '',
    `🏘️ Região: *${clean(input.customerNeighborhood)}*`,
    `📍 Entrega: ${clean(input.customerAddress)}${reference}`,
    `💳 Pagamento: ${clean(input.paymentMethod)}${fee}`,
    '',
    `⏱️ Até ${input.pickupDeadlineMinutes} min para chegar ao comércio`,
    `⏱️ Meta de até ${input.deliveryTargetMinutes} min após a retirada`,
    '',
    `✅ Para aceitar, responda: *PEGAR ${clean(input.acceptanceCode)}*`,
    '⚠️ A primeira confirmação válida fica com a entrega.',
  ].join('\n');
}
