import React from 'react';
import { shallow } from 'enzyme';

import PreviewLinkContainer from './';

describe('<PreviewLinkContainer />', () => {
  it('renders correctly', () => {
    expect(shallow(<PreviewLinkContainer />)).toMatchSnapshot();
  });
});
