import seed from '../../../../../packages/database/seeds/planaltina-go-delivery.json';

export interface DeliveryRateResolution {
  zoneCode: string;
  zoneName: string;
  subarea?: string;
  baseFee: number;
  finalFee: number;
  matchedAlias: string;
}

type DeliveryZoneSeed = (typeof seed.zones)[number];

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSubarea(value: string): string {
  const normalized = normalize(value).replace(/\s+/g, '');
  const match = normalized.match(/\b(QA?\d{1,3}|VALE)\b/);
  return match?.[1] ?? '';
}

const searchableZones = seed.zones
  .flatMap((zone) =>
    [...new Set([zone.code, zone.name, ...zone.aliases])].map((alias) => ({
      zone,
      alias,
      normalizedAlias: normalize(alias),
    })),
  )
  .sort((a, b) => b.normalizedAlias.length - a.normalizedAlias.length);

export function resolvePlanaltinaDeliveryRate(
  addressOrNeighborhood: string,
): DeliveryRateResolution | null {
  const input = normalize(addressOrNeighborhood);
  if (!input) return null;

  const matched = searchableZones.find(({ normalizedAlias }) =>
    input.includes(normalizedAlias),
  );

  if (!matched) return null;

  const zone = matched.zone as DeliveryZoneSeed;
  const subarea = normalizeSubarea(input);
  const subareaFee = subarea
    ? Number((zone.subareas as Record<string, number>)[subarea])
    : Number.NaN;
  const baseFee = Number(zone.baseFee);

  return {
    zoneCode: zone.code,
    zoneName: zone.name,
    subarea: Number.isFinite(subareaFee) ? subarea : undefined,
    baseFee,
    finalFee: Number.isFinite(subareaFee) ? subareaFee : baseFee,
    matchedAlias: matched.alias,
  };
}

export function resolveDistantRouteFee(
  origin: string,
  destination: string,
): number | null {
  const from = resolvePlanaltinaDeliveryRate(origin)?.zoneCode;
  const to = resolvePlanaltinaDeliveryRate(destination)?.zoneCode;
  if (!from || !to) return null;

  const distant = seed.distantPairs.some(
    (pair) =>
      (pair.from === from && pair.to === to) ||
      (pair.from === to && pair.to === from),
  );

  return distant ? Number(seed.distantPairFee) : null;
}
