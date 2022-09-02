import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import { ButtonRow, Img } from './components';

describe('SendCorrespondence components', () => {
  it('should render <ButtonRow /> correctly', () => {
    expect(shallow(<ButtonRow />)).toMatchSnapshot();
  });

  it('should render <Img /> correctly', () => {
    expect(shallow(<Img />)).toMatchSnapshot();
  });
});
