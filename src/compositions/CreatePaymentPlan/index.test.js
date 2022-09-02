import React from 'react';
import { shallow } from 'enzyme';
import { RadioGroup } from 'nhh-styles';
import { FormWrapper } from '../../components';

import { CreatePaymentPlanCompositions } from './';

jest.mock('date-fns/start_of_today', () => () => new Date('2018-08-01'));

function sel(id) {
  return `[data-state-key="${id}"]`;
}

describe('<CreatePaymentPlanCompositions />', () => {
  let props;
  let el;
  const preventDefault = jest.fn();

  beforeEach(() => {
    props = {
      clearError: jest.fn(),
      isLoading: false,
      currencySymbol: '£',
      error: false,
      errorText: {
        installmentAmount: 'Please enter an installment amount',
        installmentAmountNotNumber: 'Please provide a number',
        installmentFrequency: 'Please select an installment frequency',
        installmentPeriod: 'Please select an installment period',
        note: 'Please enter some notes',
        planType: 'Please select a plan type',
        startDate: 'Please enter a start date',
      },
      formError: '',
      installmentPeriods: [
        {
          id: 'Weekly',
          value: 'Weekly',
        },
        {
          id: 'Monthly',
          value: 'Monthly',
        },
      ],
      labels: {
        attachFile: 'Attach documents',
        backButton: 'Back',
        installmentAmount: 'Instalment amount',
        installmentFrequency: 'Instalment frequency',
        installmentPeriod: 'Instalment period',
        note: 'note',
        paymentPlanType: 'Payment plan type',
        startDate: 'Start date',
        submitButton: 'Create Payment Plan',
      },
      onBack: jest.fn(),
      onSubmit: jest.fn(),
      planFrequency: 4,
      planTypes: [
        {
          id: 'Personal',
          value: 'Personal Payment Plan',
        },
        {
          id: 'CourtOrdered',
          value: 'Court Order',
        },
      ],
      updatePageHeader: jest.fn(),
    };

    el = shallow(<CreatePaymentPlanCompositions {...props} />);
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should call updatePageHeader', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  describe('Form state changes', () => {
    it('should update state when planType changes', () => {
      const planType = el.find(sel('planType'));
      const targetPlanType = props.planTypes.find(
        pt => pt.value === planType.first().prop('children')
      ).id;
      planType.get(0).props.onChange();
      el.update();
      expect(el.state().planType).toEqual(targetPlanType);
    });

    it('should update state when loading', () => {
      el.setProps({ isLoading: true });
      el.update();
      expect(el).toMatchSnapshot();
    });

    it('should update state when installmentAmount changes', () => {
      const installmentAmount = el.find(sel('installmentAmount'));
      const target = '132';
      installmentAmount
        .props()
        .onChange({ target: { dataset: { stateKey: 'installmentAmount' }, value: target } });
      el.update();
      expect(el.state().installmentAmount).toEqual(target);
    });

    it('should update state when installmentPeriod changes', () => {
      const installmentPeriod = el.find(sel('installmentPeriod'));
      const target = props.installmentPeriods[0].id;
      installmentPeriod.props().onChange({ id: target });
      el.update();
      expect(el.state().installmentPeriod).toEqual(target);
    });

    it('should update state when installmentFrequency changes', () => {
      const installmentFrequency = el.find(sel('installmentFrequency'));
      const target = 1;
      installmentFrequency.props().onChange(target);
      el.update();
      expect(el.state().installmentFrequency).toEqual(target);
    });

    it('should update state when startDate changes', () => {
      const startDate = el.find(sel('startDate'));
      const target = new Date('2018-02-22T00:00:00.000Z');
      startDate.props().onDateSelected(null, target);
      el.update();
      expect(el.state().startDate).toEqual(target);
    });

    it('should update state when note changes', () => {
      const note = el.find(sel('note'));
      const target = 'some note';
      note.props().onChange({ target: { dataset: { stateKey: 'note' }, value: target } });
      el.update();
      expect(el.state().note).toEqual(target);
    });
  });

  describe('Form validations', () => {
    const submitForm = currentEl =>
      currentEl.find(FormWrapper).props().handleFormSubmit({ preventDefault });

    describe('Plan type', () => {
      it('should set the correct error when plan type is not selected', () => {
        submitForm(el);
        el.update();
        expect(el.find(RadioGroup).find('[name="planType"]').props().error).toMatchSnapshot();
        expect(props.onSubmit).not.toHaveBeenCalled();
      });

      it('should NOT set any errors when plan type is selected', () => {
        const planTypeOption1 = el.find(sel('planType')).first();
        planTypeOption1.props().onChange();
        el.update();
        submitForm(el);
        expect(planTypeOption1.props().error).toBeFalsy();
      });
    });

    describe('Installment amount', () => {
      it('should set the correct error when installment amount is not provided', () => {
        submitForm(el);
        el.update();
        const installmentAmount = el.find(sel('installmentAmount'));
        expect(installmentAmount.props().error).toMatchSnapshot();
        expect(props.onSubmit).not.toHaveBeenCalled();
      });

      it('should set the correct error when installment amount is not a number', () => {
        el.find(sel('installmentAmount'))
          .props()
          .onChange({ target: { dataset: { stateKey: 'installmentAmount' }, value: 'string' } });
        submitForm(el);
        el.update();

        expect(el.find(sel('installmentAmount')).props().error).toMatchSnapshot();
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
      it('should NOT set any errors when installment amount is provided', () => {
        el.find(sel('installmentAmount'))
          .props()
          .onChange({ target: { dataset: { stateKey: 'installmentAmount' }, value: '312' } });
        submitForm(el);
        el.update();
        expect(el.find(sel('installmentAmount')).props().error).toBe('');
      });
    });

    describe('Installment Period', () => {
      it('should set the correct error when installment period is not selected', () => {
        submitForm(el);
        el.update();
        const installmentPeriod = el.find(sel('installmentPeriod'));
        expect(installmentPeriod.props().error).toMatchSnapshot();
        expect(props.onSubmit).not.toHaveBeenCalled();
      });

      it('should NOT set any errors when installment period is provided', () => {
        const target = props.installmentPeriods[0].id;
        el.find(sel('installmentPeriod')).props().onChange({ id: target });
        submitForm(el);
        el.update();
        expect(el.find(sel('installmentPeriod')).props().error).toBe('');
      });
    });

    describe('Installment frequency', () => {
      it('should set the correct error when installment frequency is not selected', () => {
        submitForm(el);
        el.update();
        const installmentFrequency = el.find(sel('installmentFrequency'));
        expect(installmentFrequency.props().error).toMatchSnapshot();
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
      it('should NOT set any errors when installment frequency is provided', () => {
        el.find(sel('installmentFrequency')).props().onChange(1);
        submitForm(el);
        el.update();
        expect(el.find(sel('installmentFrequency')).props().error).toBe('');
      });
    });

    describe('Start date', () => {
      it('should set the correct error when start date is not selected', () => {
        submitForm(el);
        el.update();
        const startDate = el.find(sel('startDate'));
        expect(startDate.props().error).toMatchSnapshot();
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
      it('should NOT set the correct error when start date is selected', () => {
        el.find(sel('startDate'))
          .props()
          .onDateSelected(null, new Date('2018-02-22T00:00:00.000Z'));
        submitForm(el);
        el.update();
        expect(el.find(sel('startDate')).props().error).toBe('');
      });
    });

    it('should call the passed in onSubmit when all validations pass', () => {
      const initialState = {
        wantsToAttachFiles: false,
        installmentAmount: 300.3,
        installmentPeriod: props.installmentPeriods[0].id,
        installmentFrequency: 1,
        planType: props.planTypes[0].id,
        startDate: new Date('2018-08-01'),
        note: 'Some notes',
      };
      const targetState = {
        description: initialState.note,
        installment: {
          amount: initialState.installmentAmount,
          period: initialState.installmentFrequency,
          schedule: initialState.installmentPeriod,
        },
        startDate: initialState.startDate,
        type: initialState.planType,
      };
      el.setState(initialState);
      el.instance().handleSubmit({ preventDefault });
      expect(props.onSubmit).toHaveBeenCalledWith(targetState, initialState.wantsToAttachFiles);
    });
  });

  it('should call clearError on unmount', () => {
    el.unmount();
    expect(props.clearError).toHaveBeenCalled();
  });
});
