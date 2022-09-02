import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import TemplateContainer from './';

describe('TemplateContainer', () => {
  it('should render correctly', () => {
    expect(shallow(<TemplateContainer />)).toMatchSnapshot();
  });
});
