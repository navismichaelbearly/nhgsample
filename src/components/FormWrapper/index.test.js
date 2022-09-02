import React from 'react';
import { shallow } from 'enzyme';
import { Button } from 'nhh-styles';

import FormWrapper from './';

describe('<FormWrapper />', () => {
  const preventDefault = jest.fn();
  let props;
  let el;

  beforeEach(() => {
    props = {
      formName: 'aForm',
      handleFormSubmit: jest.fn(),
      submitButtonText: 'Submit',
    };
    el = shallow(<FormWrapper {...props}>Hello</FormWrapper>);
  });

  it('renders correctly', () => {
    expect(el).toMatchSnapshot();
  });

  it('renders correctly without PropertyInformation', () => {
    el.setProps({
      hidePropertyInformation: true,
    });
    expect(el).toMatchSnapshot();
  });

  it('renders correctly with an error', () => {
    el.setProps({
      formError: 'An error!',
    });
    expect(el).toMatchSnapshot();
  });

  it('renders correctly when loading', () => {
    el.setProps({
      loading: true,
    });
    expect(el).toMatchSnapshot();
  });

  it('renders correctly with disabled submit', () => {
    el.setProps({
      disableSubmit: true,
    });
    expect(el).toMatchSnapshot();
  });

  it('renders correctly with disabled back', () => {
    el.setProps({
      disableBack: true,
    });
    expect(el).toMatchSnapshot();
  });

  it('renders correctly with additional actions', () => {
    el.setProps({
      otherActions: <Button>Another button</Button>,
    });
    expect(el).toMatchSnapshot();
  });

  it('renders correctly with additional actions', () => {
    el.setProps({
      otherActionsLeft: <Button>Another button on the left</Button>,
    });
    expect(el).toMatchSnapshot();
  });

  it('should not submit form when onSubmit form fires', () => {
    el.find('form').simulate('submit', { preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(props.handleFormSubmit).not.toHaveBeenCalled();
  });

  it('fires on submit function when submit button is clicked', () => {
    el.find('[data-bdd="aForm-submit"]').simulate('click');
    expect(props.handleFormSubmit).toHaveBeenCalled();
  });

  describe('Back button', () => {
    const backButtonClick = jest.fn();
    beforeEach(() => {
      el.setProps({
        backButtonText: 'Back',
        handleBackClick: backButtonClick,
      });
    });

    it('renders correctly', () => {
      expect(el).toMatchSnapshot();
    });

    it('fires on submit function when form is submitted', () => {
      el.find('[data-bdd="aForm-back"]').simulate('click');
      expect(backButtonClick).toHaveBeenCalled();
    });
  });
});
