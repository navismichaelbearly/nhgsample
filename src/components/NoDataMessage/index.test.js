import React from 'react';
import { shallow } from 'enzyme';

import NoDataMessage from './';

describe('NoDataMessage', () => {
  it('should render correctly', () => {
    expect(shallow(<NoDataMessage message={'protect Gotham'} />)).toMatchSnapshot();
  });
});
