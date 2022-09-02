import React from 'react';
import { shallow } from 'enzyme';
import Payment from './Payment';

describe('<Payment />', () => {
  let props;

  beforeEach(() => {
    props = {
      caseSubType: 'RecurringCard',
      createdBy: {
        displayName: 'Bob',
      },
      labels: {
        CardPayment: 'CardPayment',
        createdBy: 'createdBy',
        createdOn: 'createdOn',
        DirectDebit: 'DirectDebit',
        endDate: 'endDate',
        firstPayment: 'firstPayment',
        frequency: {
          Fortnightly: 'Fortnightly',
          Fourweekly: 'Fourweekly',
          HalfYearly: 'HalfYearly',
          LastFridayOfTheMonth: 'LastFridayOfTheMonth',
          Monthly: 'Monthly',
          Quarterly: 'Quarterly',
          Weekly: 'Weekly',
          Yearly: 'Yearly',
        },
        heading: 'heading',
        instalmentAmount: 'instalmentAmount',
        paymentAmount: 'paymentAmount',
        paymentFrequency: 'paymentFrequency',
        paymentMethod: 'paymentMethod',
        paymentStatus: 'paymentStatus',
        RecurringCard: 'RecurringCard',
      },
      createdOn: '2018-11-27T11:11:10+00:00',
      paymentValue: 100,
      status: 'status',
    };
  });

  it('renders correctly for a card payment', () => {
    expect(shallow(<Payment {...props} />)).toMatchSnapshot();
  });

  it('renders correctly for a direct debit', () => {
    const ddProps = {
      ...props,
      caseSubType: 'DirectDebit',
      dateOfFirstPayment: '2018-12-11T00:00:00+00:00',
      paymentEndDate: '2018-12-20T00:00:00+00:00',
      paymentFrequency: 'Fortnightly',
    };
    expect(shallow(<Payment {...ddProps} />)).toMatchSnapshot();
  });

  it('renders correctly for a recurring payment', () => {
    const rpProps = {
      ...props,
      caseSubType: 'RecurringCard',
      dateOfFirstPayment: '2018-12-11T00:00:00+00:00',
      paymentEndDate: '2018-12-20T00:00:00+00:00',
      paymentFrequency: 'HalfYearly',
    };
    expect(shallow(<Payment {...rpProps} />)).toMatchSnapshot();
  });
});
