import React from 'react';
import { shallow } from 'enzyme';

import { PatchesWrapper } from './components';

describe('<PatchesWrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<PatchesWrapper />)).toMatchSnapshot();
  });
});
