import React from 'react';
import { shallow } from 'enzyme';
import Container from './components';

describe('ArrearsNotifications components', () => {
  it('should render default container correctly', () => {
    expect(shallow(<Container />)).toMatchSnapshot();
  });
});
