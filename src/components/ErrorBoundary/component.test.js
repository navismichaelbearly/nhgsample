import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import Heading from './component';

describe('ErrorBoundary components', () => {
  it('should render <Heading /> correctly', () => {
    expect(shallow(<Heading />)).toMatchSnapshot();
  });
});
