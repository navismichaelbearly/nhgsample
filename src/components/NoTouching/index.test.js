import React from 'react';
import { shallow } from 'enzyme';

import NoTouching from './';

describe('<NoTouching />', () => {
  it('renders correctly', () => {
    expect(shallow(<NoTouching>Hello</NoTouching>)).toMatchSnapshot();
  });

  it('passes on props correctly', () => {
    expect(shallow(<NoTouching foo="bar">Hello</NoTouching>)).toMatchSnapshot();
  });

  it('Does not re-render on props change', () => {
    const el = shallow(<NoTouching foo="bar">Hello</NoTouching>);
    el.setProps({ children: 'Goodbye' });
    el.update();
    expect(el).toMatchSnapshot();
  });
});
