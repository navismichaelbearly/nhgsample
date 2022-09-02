import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import {
  HighlightedSection,
  HighlightedTitle,
  HighlightedAmount,
  Seperator,
  StatsContainer,
  UnderLinedText,
} from './components';

describe('PatchStatistics components', () => {
  it('should render <HighlightedSection /> correctly', () => {
    expect(
      shallow(<HighlightedSection theme={{ colors: { support: { two: 'red' } } }} />)
    ).toMatchSnapshot();
  });

  it('should render <HighlightedTitle /> correctly', () => {
    expect(shallow(<HighlightedTitle />)).toMatchSnapshot();
  });

  it('should render <HighlightedAmount /> correctly', () => {
    expect(shallow(<HighlightedAmount />)).toMatchSnapshot();
  });

  it('should render <Seperator /> correctly', () => {
    expect(shallow(<Seperator />)).toMatchSnapshot();
  });

  it('should render <Seperator /> correctly', () => {
    expect(shallow(<Seperator />)).toMatchSnapshot();
  });

  it('should render <UnderLinedText /> correctly', () => {
    expect(shallow(<UnderLinedText />)).toMatchSnapshot();
  });

  it('should render <StatsContainer /> correctly', () => {
    expect(shallow(<StatsContainer />)).toMatchSnapshot();
  });
});
