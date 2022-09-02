import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import {
  Activity,
  ActivityBody,
  ActivityLabel,
  ActivityLink,
  H3,
  Wrapper,
  ActivityDescription,
} from './components';

describe('ActivityHistory components', () => {
  it('should render <Activity /> correctly', () => {
    expect(shallow(<Activity />)).toMatchSnapshot();
  });
  it('should render <ActivityBody /> correctly', () => {
    expect(shallow(<ActivityBody />)).toMatchSnapshot();
  });
  it('should render <ActivityLabel /> correctly', () => {
    expect(shallow(<ActivityLabel />)).toMatchSnapshot();
  });
  it('should render <ActivityLink /> correctly', () => {
    expect(shallow(<ActivityLink />)).toMatchSnapshot();
  });
  it('should render <H3 /> correctly', () => {
    expect(shallow(<H3 />)).toMatchSnapshot();
  });
  it('should render <Wrapper /> correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
  it('should render <ActivityDescription /> correctly', () => {
    expect(shallow(<ActivityDescription />)).toMatchSnapshot();
  });
});
