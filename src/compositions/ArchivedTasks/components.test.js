import React from 'react';
import { shallow } from 'enzyme';

import { Wrapper, LinkedItems } from './components';

describe('<Wrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
});

describe('<LinkedItems />', () => {
  it('should render correctly', () => {
    expect(shallow(<LinkedItems />)).toMatchSnapshot();
  });
});
