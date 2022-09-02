import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import { Img, MainButton } from './components';

describe('PreviewTemplate components', () => {
  it('should render <Img /> correctly', () => {
    expect(shallow(<Img />)).toMatchSnapshot();
  });

  it('should render <MainButton /> correctly', () => {
    expect(shallow(<MainButton />)).toMatchSnapshot();
  });
});
