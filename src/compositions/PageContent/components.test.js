import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import { Content } from './components';

describe('Page components', () => {
  it('should render <Content /> correctly', () => {
    expect(shallow(<Content />)).toMatchSnapshot();
  });
});
