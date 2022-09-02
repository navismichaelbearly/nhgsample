import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import { Wrapper, OverdueLabel } from './components';

describe('TasksSummaryCards components', () => {
  it('should render <Wrapper /> correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
  it('should render <OverdueLabel /> correctly', () => {
    expect(shallow(<OverdueLabel />)).toMatchSnapshot();
  });
});
