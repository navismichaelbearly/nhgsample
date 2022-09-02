import React from 'react';
import { shallow } from 'enzyme';

import PreviewLink from './';

describe('<PreviewLink />', () => {
  it('renders correctly', () => {
    expect(shallow(<PreviewLink />)).toMatchSnapshot();
  });
});
