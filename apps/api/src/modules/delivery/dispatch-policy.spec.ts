import { calculateDispatchSla } from './dispatch-policy';

describe('calculateDispatchSla', () => {
  it('aplica 10 minutos para coleta e 20 minutos para entrega por padrão', () => {
    const readyAt = new Date('2026-07-27T12:00:00.000Z');
    const result = calculateDispatchSla({ readyAt });

    expect(result.pickupWindowMinutes).toBe(10);
    expect(result.deliveryWindowMinutes).toBe(20);
    expect(result.pickupDeadlineAt.toISOString()).toBe('2026-07-27T12:10:00.000Z');
    expect(result.deliveryDeadlineAt.toISOString()).toBe('2026-07-27T12:30:00.000Z');
  });

  it('acrescenta tempo específico da região', () => {
    const readyAt = new Date('2026-07-27T12:00:00.000Z');
    const result = calculateDispatchSla({
      readyAt,
      regionalExtraMinutes: 15,
    });

    expect(result.deliveryWindowMinutes).toBe(35);
    expect(result.deliveryDeadlineAt.toISOString()).toBe('2026-07-27T12:45:00.000Z');
  });

  it('rejeita data inválida', () => {
    expect(() => calculateDispatchSla({ readyAt: new Date('invalid') })).toThrow(
      'readyAt deve ser uma data válida',
    );
  });
});
