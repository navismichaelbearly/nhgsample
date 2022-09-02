import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import NotificationWrapper from './';

describe('NotificationWrapper', () => {
  it('should render correctly', () => {
    expect(shallow(<NotificationWrapper />)).toMatchSnapshot();
  });
});
