import React from 'react';
import { shallow } from 'enzyme';

import ErrorBoundary from './';

describe('Error Boundary', () => {
  const props = {
    messageOnScreen: 'Something went wrong.',
  };

  const compositeComponent = (
    <ErrorBoundary messageOnScreen={props.messageOnScreen}>
      <p>this is a test!</p>
    </ErrorBoundary>
  );

  it('renders correctly', () => {
    expect(shallow(compositeComponent)).toMatchSnapshot();
  });

  it('generates a error message when an error is caught', () => {
    const component = shallow(compositeComponent);
    component.setState({
      hasError: true,
    });
    component.update();
    expect(component.children().text()).toEqual('Something went wrong.');
  });
});
