import React from 'react';
import { shallow } from 'enzyme';
import { ErrorBoundary } from '../../components';

import { PageContentComposition } from './';

describe('<PageContentComposition />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      ignoreArrearFetch: false,
      getArrearsDetail: jest.fn(),
      heading: 'A headng',
      errorMessage: 'Something has gone terribly wrong here bhuuaaa',
    };
    el = shallow(<PageContentComposition {...props}>Hello</PageContentComposition>);
  });

  it('renders correctly', () => {
    expect(el).toMatchSnapshot();
  });

  it('renders correctly when loading', () => {
    el.setProps({ loading: true });
    expect(el).toMatchSnapshot();
  });

  it('renders correctly with a ribbon', () => {
    el.setProps({
      ribbon: {
        title: 'A different heading',
      },
    });
    expect(el).toMatchSnapshot();
  });

  it('calls getArrearsDetail', () => {
    expect(props.getArrearsDetail).toHaveBeenCalled();
  });

  it('wraps main children in ErrorBoundary', () => {
    const eb = el.find(ErrorBoundary);
    expect(eb).toHaveLength(3);
  });
});

describe('<PageContentComposition /> with ignoreArrearFetch = true', () => {
  let props;

  beforeEach(() => {
    props = {
      ignoreArrearFetch: true,
      getArrearsDetail: jest.fn(),
      heading: 'A headng',
      errorMessage: 'Something has gone terribly wrong here bhuuaaa',
    };
  });

  it(" doesn't call getArrearsDetail", () => {
    shallow(<PageContentComposition {...props}>Hello</PageContentComposition>);
    expect(props.getArrearsDetail).not.toHaveBeenCalled();
  });
});
