import React from 'react';
import { shallow } from 'enzyme';
import { SuccessWrapper, ErrorWrapper, ErrorText, LabelWrapper, TableWrapper } from './components';

describe('<SuccessMessage />', () => {
  it('should render correctly', () => {
    expect(shallow(<SuccessWrapper />)).toMatchSnapshot();
  });
});

describe('<ErrorWrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<ErrorWrapper />)).toMatchSnapshot();
  });
});

describe('<LabelWrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<LabelWrapper />)).toMatchSnapshot();
  });
});

describe('<ErrorText />', () => {
  it('should render correctly', () => {
    expect(shallow(<ErrorText />)).toMatchSnapshot();
  });
});

describe('<TableWrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<TableWrapper />)).toMatchSnapshot();
  });
});
