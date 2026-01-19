export enum LeadStatus {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD',
  CONVERTED = 'CONVERTED',
  LOST = 'LOST'
}

export enum LeadIntent {
  PRICING = 'PRICING',
  AMENITIES = 'AMENITIES',
  LOCATION = 'LOCATION',
  RERA = 'RERA',
  POSSESSION = 'POSSESSION',
  PAYMENT_PLAN = 'PAYMENT_PLAN',
  LOAN = 'LOAN',
  SITE_VISIT = 'SITE_VISIT',
  GENERAL = 'GENERAL'
}

export const LEAD_SCORING = {
  HOT: 8,
  WARM: 4,
  COLD: 1
};

export const FOLLOWUP_INTERVALS = {
  HOT: 2 * 60 * 60 * 1000, // 2 hours
  WARM: 24 * 60 * 60 * 1000, // 24 hours
  COLD: 3 * 24 * 60 * 60 * 1000 // 3 days
};

export const QUALIFICATION_WEIGHTS = {
  BUDGET: 3,
  UNIT_TYPE: 2,
  TIMELINE: 2,
  LOCATION: 1,
  AMENITIES: 1
};
