import React from 'react';
import { shallow } from 'enzyme';
import * as nhhStyles from 'nhh-styles';
import PaymentPlan from './PaymentPlan';

nhhStyles.formatting.formatDate = jest.fn(() => '10/08/2018 - 8:52pm');

describe('<PaymentPlan />', () => {
  let props;

  beforeEach(() => {
    props = {
      lastModifiedAt: '2018-10-18T10:23:56Z',
      lastModifiedBy: 'Test_1 HO',
      status: 'Open',
      installment: { amount: 10.0, period: 2, schedule: 'Weekly' },
      startDate: '2018-10-18T00:00:00Z',
      endDate: '2018-11-01T00:00:00Z',
      description: 'alessio test',
      originalType: 'Personal Payment Plan',
      labels: {
        installmentArrangementFormat: '{amount} Every {period} {schedule}(s)',
        endDate: 'End date',
        installmentAmount: 'Instalment amount',
        installmentFrequency: 'Instalment frequency',
        installment: 'Instalment',
        installmentPeriod: 'Instalment period',
        raisedBy: 'Raised by',
        startDate: 'Start date',
        lastModifiedAt: 'Last modified',
        lastModifiedBy: 'Last Modified By',
        status: 'Status',
        description: 'Details',
        contactName: 'Contact Name',
        detail: 'Detail',
        endedBy: 'Ended By',
      },
    };
  });

  it('renders correctly', () => {
    expect(shallow(<PaymentPlan {...props} />)).toMatchSnapshot();
  });

  it('renders correctly with endDate = null', () => {
    expect(shallow(<PaymentPlan {...{ endDate: null, ...props }} />)).toMatchSnapshot();
  });
});
