import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import { InnerContainer, OuterContainer } from './components';

describe('Page components', () => {
  it('should render <InnerContainer /> correctly', () => {
    expect(shallow(<InnerContainer />)).toMatchSnapshot();
  });
  it('should render <OuterContainer /> correctly', () => {
    expect(shallow(<OuterContainer />)).toMatchSnapshot();
  });
});
