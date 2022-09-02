import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import { Wrapper, MenuItemsWrapper, ItemWrapper } from './components';

describe('ArrearsActions components', () => {
  it('should render <Wrapper /> correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
  it('should render <MenuItemsWrapper /> correctly', () => {
    expect(shallow(<MenuItemsWrapper />)).toMatchSnapshot();
  });
  it('should render <MenuItemsWrapper /> correctly', () => {
    expect(shallow(<ItemWrapper />)).toMatchSnapshot();
  });
});
