import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import { H3, P, Wrapper } from './components';

describe('TenancyTransactions components', () => {
  it('should render <H3 /> correctly', () => {
    expect(shallow(<H3 />)).toMatchSnapshot();
  });
  it('should render <P /> correctly', () => {
    expect(shallow(<P />)).toMatchSnapshot();
  });
  it('should render <Wrapper /> correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
});
