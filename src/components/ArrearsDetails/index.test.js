import React from 'react';
import { shallow, mount } from 'enzyme';

import ArrearsDetails from './';

describe('<ArrearsDetails />', () => {
  let props;

  beforeEach(() => {
    props = {
      arrearsLength: 5,
      rentDetail: {},
      createdOn: '2018-07-15T13:12:07.193Z',
      heading: 'Arrears details',
      labels: {
        installmentArrangementFormat: '{amount} Every {period} {schedule}(s)',
        rentDetails: {
          paymentReferenceNumber: 'Payment reference number',
          paymentFrequency: 'Debit frequency',
          collectionRate: {
            label: 'Collection rate {value}',
            value5w: '(5W)',
            value4m: '(4M)',
            value: '{value}%',
          },
          grossRent: {
            label: 'Gross rent',
          },
          serviceCharge: {
            label: 'Service charge',
          },
          parkingCharge: 'Parking charge',
          debitFrequency: 'Debit frequency',
          directDebit: 'direct debit',
          recurringCardPayment: 'recurring card payment',
          lastPaymentMethod: 'Last Payment method',
          monthly: 'MONTHLY',
        },
        lengthOfArrears: 'Length of arrears',
        lengthOfArrearsValue: '{days} days (case started on {date})',
        none: 'None',
        patchOwner: 'Patch owner',
        pauses: {
          active: '(active)',
          draftLabel: 'Draft pauses',
          draftPausePeriod: 'Requested from {from} to {to}',
          label: 'Pauses',
          pausePeriod: 'Paused from {from} to {to}',
          pendingApproval: '(pending approval)',
          isExtended: '(extended)',
        },
        paymentPlan: {
          endDate: 'End date:',
          frequency: 'Frequency:',
          instalmentAmount: 'Instalment amount:',
          label: 'Payment plan',
          period: 'Period:',
          startDate: 'Start date:',
          type: 'Type:',
        },
        welfareReform: {
          bedroomTax: 'Bedroom tax:',
          benefitCap: 'Benefit cap:',
          claimStartDate: 'Claim start date:',
          label: 'Welfare reform',
          paymentDay: 'Payment day:',
          universalCredit: 'Universal credit:',
        },
        referralStatus: {
          label: 'Referrals',
          value: '{team}, {date}',
        },
        status: 'Arrears status',
        workwiseReference: 'Workwise reference',
      },
      owner: {
        name: 'Fred',
      },
      phases: [{ name: 'Phase 1' }, { name: 'Phase 2', current: true }],
      status: 'Active',
      workwiseReferenceNumber: '12345',
      legalReferral: {
        title: 'legalReferral',
        createdOn: '2018-07-15T13:12:07.193Z',
      },
      primaryLegalAction: {
        title: 'primaryLegalAction',
        createdOn: '2017-04-23T13:12:07.193Z',
      },
      refferalPack: {
        legalReferralPack: {
          link: '/alink',
        },
      },
    };
  });

  it('renders correctly with minimal props', () => {
    expect(shallow(<ArrearsDetails {...props} />)).toMatchSnapshot();
  });

  it('renders correctly with pauseSummary', () => {
    props.pauseSummary = [
      {
        expiryDate: '2017-04-23T13:12:07.193Z',
        startDate: '2018-07-15T13:12:07.193Z',
        status: 'Active',
      },
    ];
    expect(shallow(<ArrearsDetails {...props} />)).toMatchSnapshot();
  });

  it('renders correctly with paymentPlan', () => {
    props.paymentPlan = {
      endDate: '2017-04-23T13:12:07.193Z',
      installment: {
        amount: 50,
        period: 2,
        schedule: 'Weekly',
      },
      startDate: '2018-07-15T13:12:07.193Z',
      type: 'Foo',
    };
    expect(shallow(<ArrearsDetails {...props} />)).toMatchSnapshot();
  });

  it('renders correctly with referralSummaries', () => {
    props.referralSummaries = [
      {
        createdOn: '2018-07-15T13:12:07.193Z',
        teamName: 'Jim',
      },
      {
        createdOn: '2017-04-23T13:12:07.193Z',
        teamName: 'Bob',
      },
    ];
    expect(shallow(<ArrearsDetails {...props} />)).toMatchSnapshot();
  });

  it('renders correctly with welfareReform', () => {
    props.welfareReform = {
      universalCredit: 'Yes',
      claimStartDate: '2018-07-15T13:12:07.193Z',
      paymentDay: '15',
      benefitCap: 'Yes',
      bedroomTax: 'Yes',
    };
    expect(shallow(<ArrearsDetails {...props} />)).toMatchSnapshot();
  });

  describe('rent details', () => {
    it('renders correctly with rent details', () => {
      const p = {
        ...props,
        rentDetail: {
          paymentReference: '12039',
          collectionRate5Weeks: 11,
          collectionRate4Months: 10,
          grossRent: 123,
          charges: [
            {
              chargeCode: 'SERV',
              chargeValue: 5,
              chargeDescription: 'Hello world',
            },
          ],
          paymentFrequency: 'Weekly',
          paymentMethod: 'Direct Debit',
          currentBalance: 1230,
        },
      };
      expect(shallow(<ArrearsDetails {...p} />)).toMatchSnapshot();
    });

    it('renders 0 just fine as a collection rate %', () => {
      const p = {
        ...props,
        rentDetail: {
          collectionRate5Weeks: 0,
        },
      };

      const mounted = mount(<ArrearsDetails {...p} />);
      expect(mounted.find({ 'data-bdd': 'ArrearsDetails-paymentCollectionRate5w' }).text()).toEqual(
        '0%'
      );
    });

    it('renders -1 if current balance is 1', () => {
      const p = {
        ...props,
        rentDetail: {
          currentBalance: -1,
        },
      };

      const mounted = mount(<ArrearsDetails {...p} />);
      expect(mounted.find({ 'data-bdd': 'ArrearsDetails-arrearsCurrentBalance' }).text()).toEqual(
        '£1.00'
      );
    });

    it('renders 0 for current balance instead of -0', () => {
      const p = {
        ...props,
        rentDetail: {
          currentBalance: 0,
        },
      };

      const mounted = mount(<ArrearsDetails {...p} />);
      expect(mounted.find({ 'data-bdd': 'ArrearsDetails-arrearsCurrentBalance' }).text()).toEqual(
        '£0.00'
      );
    });
  });
});
