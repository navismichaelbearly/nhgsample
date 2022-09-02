import { PAUSE } from './pause';
import { GENERIC_PAYMENTPLAN } from './paymentPlan';
import { GENERIC_LEGAL_REFERRAL } from './legalReferral';

// eslint-disable-next-line import/prefer-default-export
export const activityHistoryTypes = {
  PAUSE,
  PAYMENT: 'Payment',
  PAYMENT_PLAN: GENERIC_PAYMENTPLAN,
  LEGAL_REFERRAL: GENERIC_LEGAL_REFERRAL,
  REFERRAL: 'Referral',
  INTERACTION: 'Interaction',
};
