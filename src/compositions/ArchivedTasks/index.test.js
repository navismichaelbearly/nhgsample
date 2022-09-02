import React from 'react';
import { shallow } from 'enzyme';

import { ArchivedTasksComposition } from './';

describe('<ArchivedTasksComposition />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      arrearsDetailHeading: 'Arrears Details',
      arrearsId: '123',
      updatePageHeader: jest.fn(),
    };

    el = shallow(<ArchivedTasksComposition {...props} />);
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should update the header', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });
});
