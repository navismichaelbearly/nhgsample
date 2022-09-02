import React from 'react';
import { shallow } from 'enzyme';
import { NotificationPanel, DateInput } from 'nhh-styles';

import { PauseArrearsCaseComposition } from './';

jest.mock('date-fns/start_of_today', () => () => new Date('2018-10-01'));

describe('<PauseArrearsCaseComposition />', () => {
  let preventDefault;
  let props;
  let el;
  let rules;
  let activePause;

  beforeEach(() => {
    preventDefault = jest.fn();
    props = {
      clearError: jest.fn(),
      roles: {
        isSeniorManager: false,
      },
      errorText: {
        endDateError: 'endDateError',
        extendedEndDateError: 'extendedEndDateError',
        formError: 'formError',
        furtherDetailError: 'furtherDetailError',
        notifyManagerError: 'notifyManagerError',
        outsideManagerPause: 'outsideManagerPause',
        outsideSeniorManagerPause: 'outsideSeniorManagerPause',
        outsideMyPause: 'outsideMyPause',
        reasonForPausingError: 'reasonForPausingError',
      },
      getPause: jest.fn(),
      labels: {
        awaitingApproval: 'Awaiting approval',
        backButton: 'Back',
        cancelButton: 'Cancel',
        endDate: 'End date',
        furtherDetail: 'Further detail',
        furtherDetailAdd: 'Add further detail',
        managerPause: 'managerPause',
        myPause: 'myPause',
        notifyManager: 'notifyManager',
        notifyManagerExtended: 'notifyManagerExtended',
        reasonForPausing: 'Reason for pausing case',
        submitButton: 'Submit',
        updateButton: 'Update',
      },
      onBack: jest.fn(),
      onCancel: jest.fn(),
      onSubmit: jest.fn(),
      updatePageHeader: jest.fn(),
    };
    rules = [
      {
        id: 'abc123',
        title: 'A reason',
        myRule: {
          endDate: '2019-07-27T13:56:50.951Z',
        },
        managerRule: {
          endDate: '2019-09-28T13:56:50.951Z',
        },
      },
      {
        id: 'def456',
        title: 'Another reason',
        myRule: {
          endDate: '2019-07-27T13:56:50.951Z',
        },
        managerRule: {
          endDate: '2019-09-28T13:56:50.951Z',
        },
      },
    ];

    activePause = {
      reasonId: 'def456',
      endDate: '2019-07-23T09:44:03.275Z',
      furtherDetail: 'further detail',
      isManagerNotified: true,
    };

    el = shallow(<PauseArrearsCaseComposition {...props} />);
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

  it('should render the page correctly with an error', () => {
    el.setProps({ error: true });
    expect(el).toMatchSnapshot();
  });

  it('should update the header', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should set the default state', () => {
    expect(el.state()).toEqual({
      endDate: null,
      errors: {},
      formError: false,
      furtherDetail: null,
      isDirty: {},
      isManagerNotified: false,
      pauseDetails: null,
      pauseRule: null,
      isFormDisabled: false,
    });
  });

  it('should display alert box at the top, when awaiting approval', () => {
    el.setProps({
      activePause: {
        ...activePause,
        status: 'Draft',
      },
    });

    expect(
      el.find({
        'data-bdd': 'pauseArrearsCase-awaitingApprovalAlert',
      })
    ).toExist();
  });

  it('should call clearError on unmount', () => {
    el.unmount();
    expect(props.clearError).toHaveBeenCalled();
  });

  it('should render the page correctly when rules are populated', () => {
    el.setProps({ rules });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly when there is an active pause', () => {
    el.setProps({
      rules,
      activePause,
    });
    expect(el).toMatchSnapshot();
  });

  it('should re-enable isManagerNotified checkbox when there is an active pause', () => {
    el.setProps({
      rules,
      activePause,
    });
    el.instance().handleFieldChange({
      preventDefault,
      target: { id: 'isManagerNotified', value: true },
    });
    el.update();
    const state = el.state();
    expect(state.isManagerNotified).toBe(true);
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly when there is an active pause and the user makes changes to a different reason so that the activePause.endDate is before myDate', () => {
    el.setProps({
      rules: [
        {
          id: 'abc123',
          title: 'A reason',
          myRule: {
            endDate: '2020-07-27T13:56:50.951Z',
          },
          managerRule: {
            endDate: '2020-09-28T13:56:50.951Z',
          },
        },
        {
          id: 'newbenefituc',
          title: 'Another reason',
          myRule: {
            endDate: '2020-07-27T13:56:50.951Z',
          },
          managerRule: {
            endDate: '2020-09-28T13:56:50.951Z',
          },
        },
      ],
      activePause,
    }).update();
    el.instance().handleFieldChange({
      target: {
        id: 'pauseRule',
        value: {
          id: 'newbenefituc',
          title: 'New Benefit/UC',
          myRule: { endDate: '2018-12-18T16:00:45.7411976+00:00' },
          managerRule: { endDate: '2019-02-05T16:00:45.7411976+00:00' },
        },
      },
    });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly when there is an active pause after myDate and before managerDate limits', () => {
    el.setProps({
      rules,
      activePause: {
        ...activePause,
        endDate: '2019-08-01T13:56:50.951Z',
      },
    });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly when there is an active pause after myDate and managerDate limits', () => {
    el.setProps({
      rules,
      activePause: {
        ...activePause,
        endDate: '2019-10-01T13:56:50.951Z',
      },
    });
    expect(el).toMatchSnapshot();
  });

  it('should reset the form and call onBack when handleBackClick fires', () => {
    el.setState({ pauseDetails: 'abc' });
    el.instance().handleBackClick();
    expect(el.state().pauseDetails).toBe(null);
    expect(props.onBack).toHaveBeenCalled();
  });

  it('should reset the form and call onCancel when handleCancelPause fires', () => {
    el.setState({ pauseDetails: 'abc' });
    el.instance().handleCancelPause();
    expect(el.state().pauseDetails).toBe(null);
    expect(props.onCancel).toHaveBeenCalled();
  });

  describe('Form interaction', () => {
    beforeEach(() => {
      el.setProps({ rules });
      el.setState({ pauseRule: rules[0] });
    });

    it('should render the page correctly when a rule has been selected', () => {
      expect(el).toMatchSnapshot();
    });

    it('should fire preventDefault when handleFieldChange fires', () => {
      el.instance().handleFieldChange({
        preventDefault,
        target: { id: 'pauseDetails', value: 'abc' },
      });
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should update state when handleFieldChange fires', () => {
      el.instance().handleFieldChange({ target: { id: 'pauseDetails', value: 'abc' } });
      const state = el.state();
      expect(state.pauseDetails).toBe('abc');
      expect(state.isDirty.pauseDetails).toBeTruthy();
    });

    it('should validate dirty fields when handleFieldChange fires', () => {
      el.instance().handleFieldChange({ target: { id: 'pauseDetails', value: '' } });
      const state = el.state();
      expect(state.errors.pauseDetails).toBe('furtherDetailError');
    });

    it('should not validate clean fields when handleFieldChange fires', () => {
      el.instance().handleFieldChange({ target: { id: 'pauseDetails', value: '' } });
      const state = el.state();
      expect(state.errors.endDate).toBe(undefined);
    });

    it('should not submit the form if validation has failed', () => {
      el.instance().handleFieldChange({ target: { id: 'pauseDetails', value: '' } });
      el.instance().handleFormSubmit({ preventDefault });
      expect(props.onSubmit).not.toHaveBeenCalled();
    });

    describe('Extended date field validation', () => {
      it('should pass validation if selected date is before myDate and managerDate limits', () => {
        el.instance().handleFieldChange({
          target: { id: 'endDate', value: '2019-06-27T13:56:50.951Z' },
        });
        const state = el.state();
        expect(state.errors.extendedPauseDate.message).toBe('');
      });

      it('should not display a notification if selected date is before myDate and managerDate limits', () => {
        el.instance().handleFieldChange({
          target: { id: 'endDate', value: '2019-06-27T13:56:50.951Z' },
        });
        el.update();
        expect(el.find(NotificationPanel)).not.toExist();
      });

      it('should not set the notify manager field to required if selected date is before myDate and managerDate limits', () => {
        el.instance().handleFieldChange({
          target: { id: 'endDate', value: '2019-06-27T13:56:50.951Z' },
        });
        el.update();
        expect(el.find('[data-bdd="pauseArrearsCase-notifyManager"]').props().required).toBeFalsy();
      });

      it('should fail validation and set the correct error if selected date is after myDate and before managerDate limits', () => {
        el.instance().handleFieldChange({
          target: { id: 'endDate', value: '2019-08-27T13:56:50.951Z' },
        });
        const state = el.state();
        expect(state.errors.extendedPauseDate.message).toBe('outsideMyPause');
      });

      it('should display a notification with the correct message if selected date is after myDate and before managerDate limits', () => {
        el.instance().handleFieldChange({
          target: { id: 'endDate', value: '2019-08-27T13:56:50.951Z' },
        });
        el.update();
        const notification = el.find(NotificationPanel);
        expect(notification).toExist();
        expect(notification.props().description).toBe('outsideMyPause');
      });

      it('should set the notify manager field to required if selected date is after myDate and before managerDate limits', () => {
        el.instance().handleFieldChange({
          target: { id: 'endDate', value: '2019-08-27T13:56:50.951Z' },
        });
        el.update();
        expect(
          el.find('[data-bdd="pauseArrearsCase-notifyManager"]').props().required
        ).toBeTruthy();
      });

      it('should validate the notify manager field if selected date is after myDate and before managerDate limits', () => {
        el.setState({
          isDirty: { isManagerNotified: true },
        });
        el.instance().handleFieldChange({
          target: { id: 'endDate', value: '2019-08-27T13:56:50.951Z' },
        });
        const state = el.state();
        expect(state.errors.isManagerNotified).toBe('notifyManagerError');
      });

      it('should fail validation and set the correct error if selected date is after myDate and managerDate limits', () => {
        el.instance().handleFieldChange({
          target: { id: 'endDate', value: '2019-10-27T13:56:50.951Z' },
        });
        const state = el.state();
        expect(state.errors.extendedPauseDate.message).toBe('outsideManagerPause');
      });

      it('should display a notification with the correct message if selected date is after myDate and managerDate limits', () => {
        el.instance().handleFieldChange({
          target: { id: 'endDate', value: '2019-10-27T13:56:50.951Z' },
        });
        el.update();
        const notification = el.find(NotificationPanel);
        expect(notification).toExist();
        expect(notification.props().description).toBe('outsideManagerPause');
      });

      it('should display a validation message on the date field if selected date is after myDate and managerDate limits', () => {
        el.setState({
          isDirty: { isManagerNotified: true },
        });
        el.instance().handleFieldChange({
          target: { id: 'endDate', value: '2019-10-27T13:56:50.951Z' },
        });
        el.update();
        expect(el.find(DateInput).props().error).toBe('extendedEndDateError');
      });

      it('should not submit the form if outside of managerDate limits', () => {
        el.instance().handleFieldChange({
          target: { id: 'endDate', value: '2019-10-27T13:56:50.951Z' },
        });
        el.instance().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
    });

    describe('Form submit', () => {
      beforeEach(() => {
        el.setState({
          endDate: '2019-06-27T13:56:50.951Z',
          pauseDetails: 'Some details',
          isManagerNotified: true,
          pauseRule: rules[0],
        });
      });

      it('should submit the form with the expected payload if all is well and it is a new pause', () => {
        el.instance().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).toHaveBeenCalledWith(
          {
            reasonId: rules[0].id,
            endDate: '2019-06-27T13:56:50.951Z',
            description: 'Some details',
            notifyManager: true,
            requireManagerApproval: false,
          },
          false
        );
      });

      it('should submit the form with the expected payload if all is well and it is an existing pause', () => {
        el.setProps({ activePause });
        el.instance().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).toHaveBeenCalledWith(
          {
            reasonId: rules[1].id,
            endDate: '2019-07-23T09:44:03.275Z',
            description: 'Some details',
            notifyManager: true,
            requireManagerApproval: false,
          },
          true
        );
      });

      it('should not display Notify Manager tickbox when it is a Senior Manager creating a pause', () => {
        expect(el.find({ 'data-bdd': 'pauseArrearsCase-notifyManager' })).toExist();

        el.setProps({
          roles: {
            isSeniorManager: true,
          },
        });

        expect(el.find({ 'data-bdd': 'pauseArrearsCase-notifyManager' })).not.toExist();
      });

      it('should submit the form with the expected payload if manager approval is required', () => {
        el.setState({
          errors: { extendedPauseDate: { didValidate: false, message: '', type: 'myRule' } },
        });
        el.instance().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).toHaveBeenCalledWith(
          {
            reasonId: rules[0].id,
            endDate: '2019-06-27T13:56:50.951Z',
            description: 'Some details',
            notifyManager: true,
            requireManagerApproval: true,
          },
          false
        );
      });
    });
  });
});
