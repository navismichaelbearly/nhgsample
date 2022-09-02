import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import { testUtils } from 'nhh-styles';

import { Wrapper, P, Label, Highlight } from './components';

describe('LegalActions components', () => {
  const theme = {
    colors: {
      support: {
        two: 'red',
      },
    },
  };

  it('should render <Wrapper /> correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
  it('should render <P /> correctly', () => {
    expect(shallow(<P />)).toMatchSnapshot();
  });
  it('should render <Label /> correctly', () => {
    expect(shallow(<Label />)).toMatchSnapshot();
  });
  it('should render <Highlight /> correctly', () => {
    expect(shallow(<Highlight theme={theme} />)).toMatchSnapshot();
  });
  it('should render <Highlight /> correctly with isExpiring - true', () => {
    const wrapper = testUtils.renderWithTheme(<Highlight theme={theme} isExpiring />);
    expect(wrapper).toMatchSnapshot();
  });
  it('should render <Highlight /> correctly with isExpiring - false', () => {
    const wrapper = testUtils.renderWithTheme(<Highlight theme={theme} />);
    expect(wrapper).toMatchSnapshot();
  });
});
