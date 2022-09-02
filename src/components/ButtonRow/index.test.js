import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import ButtonRow from './';

describe('ButtonRow', () => {
  it('should render correctly', () => {
    expect(shallow(<ButtonRow />)).toMatchSnapshot();
  });

  it('should render correctly with isCenter prop', () => {
    expect(shallow(<ButtonRow isCenter />)).toMatchSnapshot();
  });
});
