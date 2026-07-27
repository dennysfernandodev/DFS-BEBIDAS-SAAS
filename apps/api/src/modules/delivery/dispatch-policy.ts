export interface DispatchSlaInput {
  readyAt: Date;
  pickupDeadlineMinutes?: number;
  deliveryTargetMinutes?: number;
  regionalExtraMinutes?: number;
}

export interface DispatchSla {
  pickupDeadlineAt: Date;
  deliveryDeadlineAt: Date;
  pickupWindowMinutes: number;
  deliveryWindowMinutes: number;
}

const MIN_PICKUP_MINUTES = 5;
const MAX_PICKUP_MINUTES = 60;
const MIN_DELIVERY_MINUTES = 5;
const MAX_DELIVERY_MINUTES = 180;
const MAX_REGIONAL_EXTRA_MINUTES = 120;

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(Math.trunc(value), min), max);
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

/**
 * Política inicial:
 * - o motoboy tem 10 minutos para chegar ao comércio;
 * - depois da retirada, a meta padrão é de 20 minutos para concluir;
 * - regiões específicas podem acrescentar minutos sem alterar o núcleo.
 */
export function calculateDispatchSla(input: DispatchSlaInput): DispatchSla {
  if (!(input.readyAt instanceof Date) || Number.isNaN(input.readyAt.getTime())) {
    throw new Error('readyAt deve ser uma data válida');
  }

  const pickupWindowMinutes = clamp(
    input.pickupDeadlineMinutes ?? 10,
    MIN_PICKUP_MINUTES,
    MAX_PICKUP_MINUTES,
  );

  const baseDeliveryMinutes = clamp(
    input.deliveryTargetMinutes ?? 20,
    MIN_DELIVERY_MINUTES,
    MAX_DELIVERY_MINUTES,
  );

  const regionalExtraMinutes = clamp(
    input.regionalExtraMinutes ?? 0,
    0,
    MAX_REGIONAL_EXTRA_MINUTES,
  );

  const deliveryWindowMinutes = baseDeliveryMinutes + regionalExtraMinutes;
  const pickupDeadlineAt = addMinutes(input.readyAt, pickupWindowMinutes);
  const deliveryDeadlineAt = addMinutes(
    pickupDeadlineAt,
    deliveryWindowMinutes,
  );

  return {
    pickupDeadlineAt,
    deliveryDeadlineAt,
    pickupWindowMinutes,
    deliveryWindowMinutes,
  };
}
