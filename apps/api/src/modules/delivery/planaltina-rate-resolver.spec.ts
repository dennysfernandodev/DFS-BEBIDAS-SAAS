import {
  resolveDistantRouteFee,
  resolvePlanaltinaDeliveryRate,
} from './planaltina-rate-resolver';

describe('Planaltina delivery rate resolver', () => {
  it('resolves an alias without accents', () => {
    expect(resolvePlanaltinaDeliveryRate('Rua Mônaco, Barrolândia')).toMatchObject({
      zoneCode: 'BARROLANDIA',
      finalFee: 9,
    });
  });

  it('uses the subarea fee when a known quadra is present', () => {
    expect(resolvePlanaltinaDeliveryRate('Setor Norte Q21')).toMatchObject({
      zoneCode: 'SETOR NORTE',
      subarea: 'Q21',
      baseFee: 6,
      finalFee: 9,
    });
  });

  it('supports common spelling variants', () => {
    expect(resolvePlanaltinaDeliveryRate('Itapoá II')).toMatchObject({
      zoneCode: 'ITAPUA 2',
      finalFee: 10,
    });
  });

  it('returns null for an unknown area', () => {
    expect(resolvePlanaltinaDeliveryRate('endereço desconhecido')).toBeNull();
  });

  it('applies the configured distant route fee in both directions', () => {
    expect(resolveDistantRouteFee('Paquetá', 'Imigrantes')).toBe(15);
    expect(resolveDistantRouteFee('Imigrantes', 'Paquetá')).toBe(15);
  });
});
