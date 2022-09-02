import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import { NoteBody, NoteDescription, NoteItem, NoteLabel, Wrapper, H3 } from './components';

describe('Notes components', () => {
  it('should render <NoteBody /> correctly', () => {
    expect(shallow(<NoteBody />)).toMatchSnapshot();
  });
  it('should render <NoteDescription /> correctly', () => {
    expect(shallow(<NoteDescription />)).toMatchSnapshot();
  });
  it('should render <NoteItem /> correctly', () => {
    expect(shallow(<NoteItem />)).toMatchSnapshot();
  });
  it('should render <NoteLabel /> correctly', () => {
    expect(shallow(<NoteLabel />)).toMatchSnapshot();
  });
  it('should render <Wrapper /> correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
  it('should render <H3 /> correctly', () => {
    expect(shallow(<H3 />)).toMatchSnapshot();
  });
});
