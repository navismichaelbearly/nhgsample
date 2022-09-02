import React from 'react';
import { shallow } from 'enzyme';

import { ViewPaymentPlanCompositions } from './';

describe('<ViewPaymentPlanCompositions />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      clearError: jest.fn(),
      currencySymbol: '£',
      error: false,
      errorText: {
        closePlan: 'There was a problem closing this payment plan, please try again.',
      },
      getPaymentPlan: jest.fn(),
      labels: {
        backButton: 'Back',
        closeButton: 'Close Payment Plan',
        installment: 'Installment',
        installmentAmount: 'Instalment amount',
        installmentFrequency: 'Instalment frequency',
        installmentPeriod: 'Instalment period',
        note: 'Note',
        paymentPlanType: 'Payment plan type',
        raisedBy: 'Raised by',
        startDate: 'Start date',
        submitButton: 'Create Payment Plan',
      },
      paymentPlan: {
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.',
        installment: '£40 every week from 23/07/2018',
        raisedBy: 'Mabelle Ortega',
        endDate: '23/12/2018',
        startDate: '23/07/2018',
        type: 'Personal',
      },
      onBack: jest.fn(),
      onClose: jest.fn(),
      updatePageHeader: jest.fn(),
    };

    el = shallow(<ViewPaymentPlanCompositions {...props} />);
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should render the page with an error message', () => {
    el = shallow(<ViewPaymentPlanCompositions {...props} error />);
    expect(el).toMatchSnapshot();
  });

  it('should call updatePageHeader', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should call getPaymentPlan', () => {
    expect(props.getPaymentPlan).toHaveBeenCalled();
  });

  it('should call clearError on unmount', () => {
    el.unmount();
    expect(props.clearError).toHaveBeenCalled();
  });
});
