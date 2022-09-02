import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import ModalFieldRow from './';

describe('ModalFieldRow', () => {
  it('should render correctly', () => {
    expect(shallow(<ModalFieldRow />)).toMatchSnapshot();
  });
});
