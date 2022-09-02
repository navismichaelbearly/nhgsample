import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import {
  ActivityItemWrapper,
  CustomerDetailsContainer,
  LoaderContainer,
  Wrapper,
  ErrorMessage,
} from './components';

describe('ActivityHistoryItem components', () => {
  it('should render <ActivityItemWrapper /> correctly', () => {
    expect(shallow(<ActivityItemWrapper />)).toMatchSnapshot();
  });
  it('should render <CustomerDetailsContainer /> correctly', () => {
    expect(shallow(<CustomerDetailsContainer />)).toMatchSnapshot();
  });
  it('should render <LoaderContainer /> correctly', () => {
    expect(shallow(<LoaderContainer />)).toMatchSnapshot();
  });
  it('should render <Wrapper /> correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
  it('should render <ErrorMessage /> correctly', () => {
    expect(shallow(<ErrorMessage />)).toMatchSnapshot();
  });
});
