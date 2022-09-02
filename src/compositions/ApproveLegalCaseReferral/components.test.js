import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import { Link } from './components';

describe('ApproveLegalCaseReferral components', () => {
  it('should render <Link /> correctly', () => {
    expect(shallow(<Link />)).toMatchSnapshot();
  });
});
