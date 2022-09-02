import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import { Section, SectionTitle, TextBlock } from './components';

describe('View Payment Plan components', () => {
  it('should render <Section /> correctly', () => {
    expect(shallow(<Section />)).toMatchSnapshot();
  });
  it('should render <SectionTitle /> correctly', () => {
    expect(shallow(<SectionTitle />)).toMatchSnapshot();
  });
  it('should render <TextBlock /> correctly', () => {
    expect(shallow(<TextBlock />)).toMatchSnapshot();
  });
});
