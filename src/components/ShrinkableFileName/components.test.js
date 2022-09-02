import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import { AttachmentsWrapper, LabelWrapper } from './components';

describe('PreviewTemplate components', () => {
  it('should render <AttachmentsWrapper /> correctly', () => {
    expect(shallow(<AttachmentsWrapper />)).toMatchSnapshot();
  });

  it('should render <LabelWrapper /> correctly', () => {
    expect(shallow(<LabelWrapper />)).toMatchSnapshot();
  });
});
