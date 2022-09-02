import React from 'react';
import { shallow } from 'enzyme';
import { Wrapper } from './components';

describe('<Wrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
});
