import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import { IconContainer, TextContainer } from './components';

describe('IconContainer', () => {
  it('should render correctly', () => {
    expect(shallow(<IconContainer />)).toMatchSnapshot();
  });
});

describe('TextContainer', () => {
  it('should render correctly', () => {
    expect(shallow(<TextContainer />)).toMatchSnapshot();
  });
});
