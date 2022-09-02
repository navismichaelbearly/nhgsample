import { Button, NotificationPanel } from 'nhh-styles';
import React from 'react';
import { shallow } from 'enzyme';

import { TaskCloseModalComposition } from './';

function sel(id) {
  return `[data-state-key="${id}"]`;
}

describe('<TaskCloseModalComposition />', () => {
  let props;
  let el;

  const preventDefault = jest.fn();

  beforeEach(() => {
    props = {
      isLoading: false,
      errorText: {
        formError:
          'There has been an error processing this request. If the issue persists, contact your IT team',
        reason: 'Please select a reason',
      },
      labels: {
        cancelButton: 'Cancel',
        reason: 'Reason',
      },
      serverError: '',
      onCancel: jest.fn(),
      onSubmit: jest.fn(),
      onUnmount: jest.fn(),
      taskComplete: 'Task complete',
    };
    el = shallow(<TaskCloseModalComposition {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should render the page when loading', () => {
    el.setProps({ isLoadaing: true }).update();
    expect(el).toMatchSnapshot();
  });

  it('should render a notification', () => {
    props.serverError = props.errorText.formError;
    el = shallow(<TaskCloseModalComposition {...props} />);
    expect(el.find(NotificationPanel).exists()).toEqual(true);
    expect(el).toMatchSnapshot();
  });

  it('should update state when reason is entered', () => {
    const reasonText = 'some reason';
    const wrapper = el.find(sel('reason'));
    wrapper.props().onChange({ target: { value: reasonText } });
    el.update();
    expect(el.state()).toMatchObject({
      reason: reasonText,
    });
  });

  it('should call the passed in onCancel when the cancel button is clicked', () => {
    const cancelButton = el
      .find(Button)
      .findWhere(n => n.text() === props.labels.cancelButton)
      .parent();
    cancelButton.props().onClick();
    expect(props.onCancel).toHaveBeenCalled();
  });

  describe('Form submissions', () => {
    const submitForm = currentEl => currentEl.find('form').props().onSubmit({ preventDefault });

    describe('Reason', () => {
      it('should set the correct error when reason is not selected', () => {
        submitForm(el);
        el.update();
        const wrapper = el.find(sel('reason'));
        expect(wrapper.props().error).toEqual(props.errorText.reason);
        expect(props.onSubmit).not.toHaveBeenCalled();
      });

      it('should NOT set any errors when reason is selected', () => {
        const wrapper = el.find(sel('reason'));
        wrapper.props().onChange({ target: { value: 'reason' } });
        submitForm(el);
        el.update();
        expect(wrapper.props().error).toBe(null);
      });
    });

    it('should successfully call the passed in onSubmit when all validations pass', () => {
      const wrapper = el.find(sel('reason'));
      wrapper.props().onChange({ target: { value: 'reason' } });
      submitForm(el);
      expect(props.onSubmit).toHaveBeenCalled();
      expect(props.onSubmit.mock.calls[0][0]).toMatchSnapshot();
    });
  });
  it('should call onUnmount on unmount', () => {
    el.unmount();
    expect(props.onUnmount).toHaveBeenCalled();
  });
});
