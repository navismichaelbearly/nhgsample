import React from 'react';
import { shallow } from 'enzyme';
import { WelfareReformDetailsComposition } from './';

jest.mock('date-fns/start_of_today', () => () => new Date('2018-10-01'));

describe('<WelfareReformDetailsComposition />', () => {
  let preventDefault;
  let props;
  let el;

  beforeEach(() => {
    preventDefault = jest.fn();
    props = {
      labels: {
        backButton: 'Back',
        saveButton: 'Save',
      },
      onBack: jest.fn(),
      onSubmit: jest.fn(),
      updatePageHeader: jest.fn(),
      getWelfareReformDetails: jest.fn(),
      getOptionSets: jest.fn(),
    };

    el = shallow(<WelfareReformDetailsComposition {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the page correctly', () => {
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly while loading', () => {
    el.setProps({ loading: true });
    expect(el).toMatchSnapshot();
  });

  it('should update the header', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should set the default state', () => {
    expect(el.state()).toEqual({
      bedroomTax: false,
      benefitCap: false,
      claimStartDate: null,
      isDirty: {},
      paymentDay: null,
      universalCredit: false,
      apaStatus: null,
      ucArrearsPaymentStatus: null,
    });
  });

  it('should reset the form and call onBack when handleBackClick fires', () => {
    el.instance().handleBackClick();
    expect(props.onBack).toHaveBeenCalled();
  });

  describe('Form interaction', () => {
    beforeEach(() => {
      el.setState({
        universalCredit: false,
        claimStartDate: null,
        paymentDay: null,
        benefitCap: false,
        bedroomTax: false,
        apaStatus: null,
        ucArrearsPaymentStatus: null,
      });
    });

    describe('Form submit', () => {
      beforeEach(() => {
        el.setState({
          universalCredit: false,
          claimStartDate: null,
          paymentDay: null,
          benefitCap: false,
          bedroomTax: false,
          alternativePaymentArrangementStatusId: null,
          ucArrearsPaymentStatusId: null,
        });
      });

      it('should submit the form with the expected payload if all is well and it is an existing pause', () => {
        el.instance().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).toHaveBeenCalledWith({
          universalCredit: false,
          claimStartDate: null,
          paymentDay: null,
          benefitCap: false,
          bedroomTax: false,
          alternativePaymentArrangementStatusId: null,
          ucArrearsPaymentStatusId: null,
        });
      });
    });
  });
});
