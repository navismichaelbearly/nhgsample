import React from 'react';
import { shallow } from 'enzyme';

import { AppComposition } from './';

describe('<AppComposition />', () => {
  let props;

  beforeEach(() => {
    props = {
      history: {
        location: {
          pathname: '/path',
        },
      },
      login: () => {},
      logout: () => {},
      setEntryPoint: jest.fn(),
      user: {
        initialised: false,
        loggedIn: false,
        userType: 'userType',
        waiting: false,
      },
    };
  });

  it('renders correctly', () => {
    expect(shallow(<AppComposition {...props} />)).toMatchSnapshot();
  });

  it('renders correctly with a logged in user', () => {
    props.user.loggedIn = true;
    props.user.initialised = true;
    props.user.profile = { name: 'Fred' };
    expect(shallow(<AppComposition {...props} />)).toMatchSnapshot();
  });

  it('renders correctly with a logged in HO', () => {
    props.user.loggedIn = true;
    props.user.initialised = true;
    props.user.profile = { fullname: 'Fred Bloggs' };
    expect(shallow(<AppComposition {...props} />)).toMatchSnapshot();
  });

  it('calls correct methods on mount', () => {
    shallow(<AppComposition {...props} />);
    expect(props.setEntryPoint).toHaveBeenCalledWith('/path');
  });

  it('renders Header with onSearch when logged user is a housing officer', () => {
    props.user.loggedIn = true;
    props.user.initialised = true;
    props.user.profile = { name: 'Fred', isHousingOfficer: true };
    expect(shallow(<AppComposition {...props} />)).toMatchSnapshot();
  });

  it('renders Header without onSearch when logged user is not a housing officer', () => {
    props.user.loggedIn = true;
    props.user.initialised = true;
    props.user.profile = { name: 'Fred', isHousingOfficer: false };
    expect(shallow(<AppComposition {...props} />)).toMatchSnapshot();
  });
});
