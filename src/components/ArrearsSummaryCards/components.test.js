import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import { Wrapper } from './components';

describe('ArrearsSummaryCards components', () => {
  it('should render <Wrapper /> correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
});
