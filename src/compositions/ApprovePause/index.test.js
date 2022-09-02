import React from 'react';
import { shallow } from 'enzyme';

import { ApprovePauseComposition } from './';

describe('<ApprovePauseComposition />', () => {
  let preventDefault;
  let props;
  let el;

  beforeEach(() => {
    preventDefault = jest.fn();

    props = {
      activePause: {
        reasonId: 'def456',
        endDate: '2019-07-23T09:44:03.275Z',
        furtherDetail: 'further detail',
      },
      errorText: {
        approvePauseError: 'approvePauseError',
        formError: 'formError',
        reasonForDenyingError: 'reasonForDenyingError',
      },
      getPause: jest.fn(),
      labels: {
        approvePause: 'approvePause',
        backButton: 'backButton',
        furtherDetail: 'furtherDetail',
        no: 'no',
        reasonForDenying: 'reasonForDenying',
        reasonForPausing: 'reasonForPausing',
        requestedEndDate: 'requestedEndDate',
        submitButton: 'submitButton',
        yes: 'yes',
      },
      onBack: jest.fn(),
      onSubmit: jest.fn(),
      rules: [
        {
          id: 'abc123',
          title: 'A reason',
        },
        {
          id: 'def456',
          title: 'Another reason',
        },
      ],
      updatePageHeader: jest.fn(),
    };

    el = shallow(<ApprovePauseComposition {...props} />);
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

  describe('Form interaction', () => {
    it('should display reason field if approval is no', () => {
      el.setState({ approvePause: 'no' });
      el.update();
      expect(el.find('Textarea')).toExist();
      expect(el).toMatchSnapshot();
    });

    it('should not display reason field if approval is yes', () => {
      el.setState({ approvePause: 'yes' });
      el.update();
      expect(el.find('Textarea')).not.toExist();
      expect(el).toMatchSnapshot();
    });

    it('should reset the form and call onBack when handleBackClick fires', () => {
      el.setState({ approvePause: 'no' });
      el.find('FormWrapper').props().handleBackClick();
      el.update();
      expect(el.find('Textarea')).not.toExist();
      expect(props.onBack).toHaveBeenCalled();
      expect(el).toMatchSnapshot();
    });

    it('should not validate the reasonForDenying field if approvePause === yes', () => {
      el.setState({ approvePause: 'yes' });
      el.find('[data-bdd="approvePause-radioGroup-yes"]').props().onChange();
      el.update();
      expect(el).toMatchSnapshot();
      expect(el.state()).toMatchSnapshot();
    });

    it('should not validate the reasonForDenying field if approvePause === no and reason field is clean', () => {
      el.find('[data-bdd="approvePause-radioGroup-no"]').props().onChange();
      el.update();
      expect(el).toMatchSnapshot();
      expect(el.state()).toMatchSnapshot();
    });

    it('should validate the reasonForDenying field if approvePause === no and reason field is dirty', () => {
      el.setState({ isDirty: { reasonForDenying: true } });
      el.find('[data-bdd="approvePause-radioGroup-no"]').props().onChange();
      el.update();
      expect(el.find('Textarea').props().error).toBe('reasonForDenyingError');
      expect(el).toMatchSnapshot();
    });

    describe('Form submit', () => {
      it('should fire preventDefault when form is submitted', () => {
        el.find('FormWrapper').props().handleFormSubmit({ preventDefault });
        expect(preventDefault).toHaveBeenCalled();
      });

      it('should not submit the form if a radio option has not been selected', () => {
        el.find('FormWrapper').props().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).not.toHaveBeenCalled();
      });

      it('should not submit the form if pause is denied but no reason is given', () => {
        el.setState({
          approvePause: 'no',
        });
        el.find('FormWrapper').props().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).not.toHaveBeenCalled();
      });

      it('should submit the form with the expected payload if pause is approved', () => {
        el.setState({
          approvePause: 'yes',
        });
        el.find('FormWrapper').props().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).toHaveBeenCalledWith('');
      });

      it('should submit the form with the expected payload if pause is not approved', () => {
        el.setState({
          approvePause: 'no',
          reasonForDenying: 'Nu uh',
        });
        el.find('FormWrapper').props().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).toHaveBeenCalledWith('Nu uh');
      });
    });
  });
});
