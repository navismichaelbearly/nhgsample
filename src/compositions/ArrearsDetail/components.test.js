import React from 'react';
import { shallow } from 'enzyme';

import { Wrapper, CustomerDetailsContainer, LinkedItems } from './components';

describe('<Wrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
});

describe('<CustomerDetailsContainer />', () => {
  it('should render correctly', () => {
    expect(shallow(<CustomerDetailsContainer />)).toMatchSnapshot();
  });
});

describe('<LinkedItems />', () => {
  it('should render correctly', () => {
    expect(shallow(<LinkedItems />)).toMatchSnapshot();
  });
});
