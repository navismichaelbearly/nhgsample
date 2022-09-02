import path from 'ramda/src/path';
import { installmentArrangement } from './paymentPlan';
import state from '../../__mocks__/state';

const args = {
  amount: 40,
  currencySymbol: path(['dictionary', 'currencySymbol'], state()),
  period: 1,
  schedule: 'Weekly',
  startDate: '2018-07-23T13:30:24.051Z',
  strFormatter: path(
    ['dictionary', 'paymentPlan', 'notification', 'createPaymentPlanLine1'],
    state()
  ),
};

describe('installmentArrangement', () => {
  it('should provide the correct text when supplied with all the arguments', () => {
    const result = installmentArrangement(
      args.strFormatter,
      args.amount,
      args.period,
      args.startDate,
      args.schedule
    );
    expect(result).toMatchSnapshot();
  });

  it('should return null if the required arguments are not provided', () => {
    const result = installmentArrangement(args.strFormatter, null, null, null, null);
    expect(result).toBe(null);
  });
});
