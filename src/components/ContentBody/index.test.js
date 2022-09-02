import React from 'react';
import { shallow } from 'enzyme';

import ContentBlock from './';

describe('<ContentBlock />', () => {
  it('renders correctly', () => {
    expect(shallow(<ContentBlock>Hello</ContentBlock>)).toMatchSnapshot();
  });
});
