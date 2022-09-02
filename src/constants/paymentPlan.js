export const planFrequency = 4;
export const PERSONAL_PAYMENT_PLAN = 'Personal Payment Plan';
export const COURT_AGREEMENT = 'Court Agreement';

// the constant the former two map to
export const GENERIC_PAYMENTPLAN = 'PaymentPlan';
// the constant derived from the Activity response
export const ACTIVITY_PAYMENTPLAN = 'Payment Plan';

export const installmentPeriods = Object.freeze([
  {
    id: 'Weekly',
    value: 'Weekly',
    short: 'Week',
  },
  {
    id: 'Monthly',
    value: 'Monthly',
    short: 'Month',
  },
]);

export const planTypes = Object.freeze([
  {
    id: 'PersonalPaymentPlan',
    value: PERSONAL_PAYMENT_PLAN,
  },
  {
    id: 'CourtAgreement',
    value: COURT_AGREEMENT,
  },
]);

export default {
  installmentPeriods,
  planFrequency,
  planTypes,
};
