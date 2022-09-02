import React from 'react';
import { shallow } from 'enzyme';

import { TenancyTransactions } from './';

describe('<TenancyTransactions />', () => {
  let defaultProps;
  let component;

  beforeEach(() => {
    defaultProps = {
      customerAccounts: [
        {
          paymentReference: '313131',
          typeCode: 'REN',
          typeName: 'RENT ACCOUNT',
          transactions: [
            {
              amount: 173.59,
              balanceAtEffectiveDate: 1388.72,
              charge: 'DEBIT',
              creditValue: 0,
              debitValue: 173.59,
              description: 'Weekly Charge',
              effectiveDate: '2018-05-28T00:00:00',
              subType: '',
              type: 'DRS',
            },
          ],
        },
      ],
      transactionHistoryText: {
        currencySymbol: '£',
        heading: 'Transaction history (12 months)',
        effectiveDate: 'Date',
        description: 'Description',
        paidIn: 'Paid in',
        amount: 'Amount',
        charged: 'Charged',
        balance: 'Balance',
      },
    };

    component = shallow(<TenancyTransactions {...defaultProps} />);
  });

  it('renders correctly with full props', () => {
    expect(component).toMatchSnapshot();
  });

  it('renders null with no customerAccounts', () => {
    const props = {
      customerAccounts: [],
    };
    const wrapper = shallow(<TenancyTransactions {...defaultProps} {...props} />);
    expect(wrapper.get(0)).toBe(null);
  });

  it('renders null with customerAccount but with no transactions', () => {
    const props = {
      customerAccounts: [
        {
          transactions: [],
        },
      ],
    };
    const wrapper = shallow(<TenancyTransactions {...defaultProps} {...props} />);
    expect(wrapper.get(0)).toBe(null);
  });
});
