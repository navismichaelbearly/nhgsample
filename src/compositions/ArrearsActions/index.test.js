import React from 'react';
import { shallow } from 'enzyme';

import { ArrearsActionsComposition } from './';

describe('<ArrearsActionsComposition />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      actions: [
        { dataBdd: 'someText', link: '/alink', text: 'Some text' },
        { dataBdd: 'someMoreText', link: '/anotherlink', text: 'Some more text' },
      ],
    };

    el = shallow(<ArrearsActionsComposition {...props} />);
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should render the page with no actions', () => {
    el.setProps({ actions: [] });
    expect(el).toMatchSnapshot();
  });
});
