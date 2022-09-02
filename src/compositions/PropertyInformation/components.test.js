import React from 'react';
import 'jest-styled-components';

import { testUtils } from 'nhh-styles';

import { Flag } from './components';

describe('PropertyInformation components', () => {
  it('should render <Flag /> correctly', () => {
    expect(
      testUtils.renderWithTheme(<Flag theme={{ colors: { support: { two: 'red' } } }} />)
    ).toMatchSnapshot();
  });
});
