import React from 'react';
import { shallow } from 'enzyme';
import { NotificationWrapper } from '../../components';
import { ServeNOSPEarly } from './';

function sel(id) {
  return `[data-bdd="${id}"]`;
}

describe('<ServeNOSPEarly />', () => {
  let preventDefault;
  let props;
  let el;

  beforeEach(() => {
    preventDefault = jest.fn();
    props = {
      isLoading: false,
      errorMessage:
        'We have encountered an issue whilst trying to retrieve this information, please try again later.',
      labels: {
        cancel: 'Cancel',
        title: 'Please confirm you wish to serve NOSP early',
        submit: 'Serve NOSP early',
      },
      onCancel: jest.fn(),
      onSubmit: jest.fn(),
    };
    el = shallow(<ServeNOSPEarly {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should render the page when loading', () => {
    el.setProps({ isLoading: true }).update();
    expect(el).toMatchSnapshot();
  });

  it('should show a notification wrapper in case of an error', () => {
    el.setProps({
      error: true,
    });
    el.update();
    expect(el.find(NotificationWrapper).exists()).toBe(true);
  });

  it('should call the passed in onCancel when cancelling the form', () => {
    el.find(sel('serveNOSPEarly-cancel')).props().onClick({ preventDefault });
    expect(props.onCancel).toHaveBeenCalled();
  });

  it('should call the passed in onSubmit when submitting the form', () => {
    el.find('form').props().onSubmit({ preventDefault });
    expect(props.onSubmit).toHaveBeenCalled();
  });
});
