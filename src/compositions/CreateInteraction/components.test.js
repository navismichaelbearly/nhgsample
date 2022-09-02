import React from 'react';
import { shallow } from 'enzyme';
import { DateTimeContainer, WarningContainer } from './components';

describe('<DateTimeContainer />', () => {
  it('should render correctly', () => {
    expect(shallow(<DateTimeContainer />)).toMatchSnapshot();
  });
});

describe('<WarningContainer />', () => {
  it('should render correctly', () => {
    expect(
      shallow(<WarningContainer {...{ theme: { colors: { primaryLight: 'blue' } } }} />)
    ).toMatchSnapshot();
  });
});
