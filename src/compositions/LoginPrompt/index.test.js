import React from 'react';
import { shallow } from 'enzyme';

import { LoginPromptComposition as LoginPrompt } from './';

describe('<LoginPrompt />', () => {
  let props;
  let result;

  beforeEach(() => {
    props = {
      entryPoint: '/path',
      displayLogin: jest.fn(),
      updatePageTitle: jest.fn(),
      updatePageHeader: jest.fn(),
      user: {
        loggedIn: false,
        profile: {},
      },
      history: {
        push: jest.fn(),
      },
    };
    result = shallow(<LoginPrompt {...props} />);
  });

  it('renders correctly', () => {
    expect(result).toMatchSnapshot();
  });

  it('renders correctly when user is logged in', () => {
    props.user.loggedIn = true;
    props.user.profile.name = 'Test';

    expect(shallow(<LoginPrompt {...props} />)).toMatchSnapshot();
  });

  it('should redirect to entryPoint if user is logged in', () => {
    props.user.loggedIn = true;
    props.user.profile.name = 'Test';

    shallow(<LoginPrompt {...props} />);
    expect(props.history.push).toHaveBeenCalledWith('/path');
  });

  it('should redirect to / if user is logged in and entryPoint is not set', () => {
    props.user.loggedIn = true;
    props.user.profile.name = 'Test';
    delete props.entryPoint;

    shallow(<LoginPrompt {...props} />);
    expect(props.history.push).toHaveBeenCalledWith('/');
  });

  it('should redirect to / if user is logged in and entryPoint is itself (/login)', () => {
    props.user.loggedIn = true;
    props.entryPoint = '/login';
    props.user.profile.name = 'Test';

    shallow(<LoginPrompt {...props} />);
    expect(props.history.push).toHaveBeenCalledWith('/');
  });

  it('should fire displayLogin on componentDidMount', () => {
    shallow(<LoginPrompt {...props} />);
    expect(props.displayLogin).toHaveBeenCalled();
  });
});
