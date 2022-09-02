import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import { Label, Value, Title, Description } from './components';

describe('HistoryItem components', () => {
  it('should render <Label /> correctly', () => {
    expect(shallow(<Label />)).toMatchSnapshot();
  });
  it('should render <Value /> correctly', () => {
    expect(shallow(<Value />)).toMatchSnapshot();
  });
  it('should render <Title /> correctly', () => {
    expect(shallow(<Title />)).toMatchSnapshot();
  });
  it('should render <Description /> correctly', () => {
    expect(shallow(<Description />)).toMatchSnapshot();
  });
});
