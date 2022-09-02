import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import FieldRow from './';

describe('FieldRow', () => {
  it('should render correctly', () => {
    expect(shallow(<FieldRow />)).toMatchSnapshot();
  });
});
