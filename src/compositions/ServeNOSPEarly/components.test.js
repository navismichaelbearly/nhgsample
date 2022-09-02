import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import { Title } from './components';

describe('ServeNOSPEarly components', () => {
  it('should render <Title /> correctly', () => {
    expect(shallow(<Title />)).toMatchSnapshot();
  });
});
