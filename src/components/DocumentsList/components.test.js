import React from 'react';
import { shallow } from 'enzyme';
import { defaultTheme } from 'nhh-styles';
import 'jest-styled-components';

import {
  H3,
  Link,
  Container,
  DateField,
  Row,
  Column,
  Header,
  DesktopView,
  MobileAndTabletView,
  ErrorMessage,
} from './components';

describe('DocumentsList components', () => {
  it('should render <H3 /> correctly', () => {
    expect(shallow(<H3 />)).toMatchSnapshot();
  });
  it('should render <Link /> correctly', () => {
    expect(shallow(<Link />)).toMatchSnapshot();
  });
  it('should render <Container /> correctly', () => {
    expect(shallow(<Container />)).toMatchSnapshot();
  });
  it('should render <DateField /> correctly', () => {
    expect(shallow(<DateField />)).toMatchSnapshot();
  });
  it('should render <Row /> correctly', () => {
    expect(shallow(<Row theme={defaultTheme} />)).toMatchSnapshot();
  });
  it('should render <Column /> correctly', () => {
    expect(shallow(<Column theme={defaultTheme} />)).toMatchSnapshot();
  });
  it('should render <Header /> correctly', () => {
    expect(shallow(<Header theme={defaultTheme} />)).toMatchSnapshot();
  });
  it('should render <DesktopView /> correctly', () => {
    expect(shallow(<DesktopView />)).toMatchSnapshot();
  });
  it('should render <MobileAndTabletView /> correctly', () => {
    expect(shallow(<MobileAndTabletView />)).toMatchSnapshot();
  });
  it('should render <ErrorMessage /> correctly', () => {
    expect(shallow(<ErrorMessage theme={defaultTheme} />)).toMatchSnapshot();
  });
});
