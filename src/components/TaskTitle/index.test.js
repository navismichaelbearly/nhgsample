import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import TaskTitle from './';

describe('TaskTitle', () => {
  it('should render correctly', () => {
    expect(shallow(<TaskTitle />)).toMatchSnapshot();
  });
});
