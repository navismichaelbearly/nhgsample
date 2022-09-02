import { formatting } from 'nhh-styles';
import find from 'ramda/src/find';
import prop from 'ramda/src/prop';
import propEq from 'ramda/src/propEq';
import format from 'string-format';
import { installmentPeriods, GENERIC_PAYMENTPLAN } from '../constants/paymentPlan';

export const installmentArrangement = (strFormatter, amount, period, startDate, schedule) =>
  amount &&
  period &&
  startDate &&
  schedule &&
  format(strFormatter, {
    amount: formatting.formatCurrency(amount),
    period,
    startDate,
    schedule: prop('short', find(propEq('id', schedule))(installmentPeriods)),
  });

export const mapPaymentPlanActivityType = payload => ({
  ...payload,
  type: GENERIC_PAYMENTPLAN,
  originalType: payload.type,
});
