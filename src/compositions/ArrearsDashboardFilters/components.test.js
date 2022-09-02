import React from 'react';
import { shallow } from 'enzyme';

import SelectWrapper from './components';

describe('<SelectWrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<SelectWrapper />)).toMatchSnapshot();
  });
});
