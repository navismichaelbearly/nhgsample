import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import { FormContainer, Link, Wrapper, CustomerDetailsContainer } from './components';

describe('AddNote components', () => {
  it('should render <FormContainer /> correctly', () => {
    expect(shallow(<FormContainer />)).toMatchSnapshot();
  });
  it('should render <Link /> correctly', () => {
    expect(shallow(<Link />)).toMatchSnapshot();
  });
  it('should render <Wrapper /> correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
  it('should render <CustomerDetailsContainer /> correctly', () => {
    expect(shallow(<CustomerDetailsContainer />)).toMatchSnapshot();
  });
});
