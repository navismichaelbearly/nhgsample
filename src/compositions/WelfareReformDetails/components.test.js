import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import { Row } from './components';

describe('Welfare reform details components', () => {
  it('should render <Row /> correctly', () => {
    expect(shallow(<Row />)).toMatchSnapshot();
  });
});
