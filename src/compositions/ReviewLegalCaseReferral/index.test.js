import React from 'react';
import { shallow } from 'enzyme';

import state from '../../../__mocks__/state';
import { ReviewLegalCaseReferralComposition } from './';
import { LRF_STATUS } from '../../constants/legalReferral';

describe('<ReviewLegalCaseReferralComposition />', () => {
  let props;
  let el;
  let document;
  const mockState = state();

  beforeEach(() => {
    jest.useFakeTimers();
    props = {
      downloadFile: yo => yo,
      formError: 'Form error message',
      getLegalReferral: jest.fn(),
      onSubmit: jest.fn(),
      onCancel: jest.fn(),
      text: mockState.dictionary.legalCaseReferral.reviewReferral,
      updatePageHeader: jest.fn(),
      invalidateLegalReferralState: jest.fn(),
    };

    document = {
      link: 'http://www.google.co.uk',
      status: 'Success',
    };

    el = shallow(<ReviewLegalCaseReferralComposition {...props} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should render the page when requiresApproval is false', () => {
    const newEl = shallow(
      <ReviewLegalCaseReferralComposition {...props} requiresApproval={false} />
    );
    expect(newEl).toMatchSnapshot();
  });

  it('should clear the LegalReferral state', () => {
    expect(props.invalidateLegalReferralState).toHaveBeenCalled();
  });

  it('should render the page correctly when legalReferralForm is complete and legalReferralPack is being generated', () => {
    el.setProps({ ...props, referralPack: { legalReferralForm: document, legalReferralPack: {} } });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly when legalReferralForm is complete and legalReferralPack is complete', () => {
    el.setProps({
      ...props,
      referralPack: { legalReferralForm: document, legalReferralPack: document },
    });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly with generation errors', () => {
    el.setProps({
      ...props,
      referralPack: {
        legalReferralForm: { status: 'FailedRetriable' },
        legalReferralPack: { status: 'FailedRetriable' },
      },
    });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly when isChecked is true', () => {
    el.setProps({
      ...props,
      referralPack: { legalReferralForm: document, legalReferralPack: document },
    });
    el.setState({ isChecked: true });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly when hasClickedReferralForm is true', () => {
    el.setProps({
      ...props,
      referralPack: { legalReferralForm: document, legalReferralPack: document },
    });
    el.setState({ hasClickedReferralForm: true });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly when hasClickedReferralPack is true', () => {
    el.setProps({
      ...props,
      referralPack: { legalReferralForm: document, legalReferralPack: document },
    });
    el.setState({ hasClickedReferralPack: true });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly when all submit conditions are met', () => {
    el.setProps({
      ...props,
      referralPack: { legalReferralForm: document, legalReferralPack: document },
    });
    el.setState({ hasClickedReferralForm: true, hasClickedReferralPack: true, isChecked: true });
    expect(el).toMatchSnapshot();
  });

  it('should call onSubmit when form is submitted', () => {
    el.find('FormWrapper').props().handleFormSubmit();
    expect(props.onSubmit).toHaveBeenCalled();
  });

  it('should disable submit on clicking submit', () => {
    // Set form to display an enabled button
    el.setState({ hasClickedReferralForm: true, hasClickedReferralPack: true, isChecked: true });

    const beforeSubmit = el.find('FormWrapper').props().disableSubmit;

    el.find('FormWrapper').props().handleFormSubmit();
    el.update();
    const afterSubmit = el.find('FormWrapper').props().disableSubmit;

    expect(beforeSubmit).toBe(false);
    expect(afterSubmit).toBe(true);
  });

  it('should call onCancel when form is cancelled', () => {
    el.find('FormWrapper').props().handleBackClick();
    expect(props.onCancel).toHaveBeenCalledWith({
      noteText: 'Original requester cancelled',
    });
  });

  it('should render the page correctly when error is true', () => {
    el.setProps({
      ...props,
      errorStatus: 404,
      referralPack: { legalReferralForm: document, legalReferralPack: document },
    });
    el.setState({ error: true });
    expect(el).toMatchSnapshot();
  });

  it('should update the header', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should call getLegalReferral', () => {
    expect(props.getLegalReferral).toHaveBeenCalled();
  });

  it('should setInterval on mount', () => {
    const instance = el.instance();
    expect(typeof instance.interval).toBe('number');
  });

  it('should call getLegalReferral every 5 seconds, incrementing attempts', () => {
    const instance = el.instance();
    jest.runTimersToTime(10000);
    expect(instance.tries).toBe(2);
    expect(props.getLegalReferral).toHaveBeenCalledTimes(3);
  });

  it('should stop calling getLegalReferral when both documents are generated', () => {
    const instance = el.instance();
    jest.runTimersToTime(10000);
    expect(instance.tries).toBe(2);
    expect(props.getLegalReferral).toHaveBeenCalledTimes(3);
    el.setProps({
      referralPack: { legalReferralForm: document, legalReferralPack: document },
    });
    jest.runTimersToTime(20000);
    expect(instance.tries).toBe(2);
    expect(props.getLegalReferral).toHaveBeenCalledTimes(3);
    el.update();
    expect(el).toMatchSnapshot();
  });

  it('should stop calling getLegalReferral, clearInterval and set errorState if a 500 is being returned at the 6th attempt', () => {
    const instance = el.instance();
    el.setProps({
      ...props,
      errorStatus: 500,
    });
    jest.runTimersToTime(80000);
    expect(instance.tries).toBe(6);
    expect(el.state().error).toBeTruthy();
    expect(props.getLegalReferral).toHaveBeenCalledTimes(7);
    expect(instance.interval).toBe(undefined);
    el.update();
    expect(el).toMatchSnapshot();
  });

  it('should stop calling getLegalReferral when legalReferralPack status is FailedFatal', () => {
    const instance = el.instance();
    el.setProps({
      ...props,
      referralPack: {
        legalReferralForm: document,
        legalReferralPack: { link: 'http://www.google.co.uk', status: LRF_STATUS.failedFatal },
      },
    });
    jest.runTimersToTime(3600000);
    expect(instance.interval).toBe(undefined);
    el.update();
    expect(el).toMatchSnapshot();
  });

  it('should stop calling getLegalReferral when legalReferralForm status is FailedFatal', () => {
    const instance = el.instance();
    el.setProps({
      ...props,
      referralPack: {
        legalReferralPack: document,
        legalReferralForm: { link: 'http://www.google.co.uk', status: LRF_STATUS.failedFatal },
      },
    });
    jest.runTimersToTime(3600000);
    expect(instance.interval).toBe(undefined);
    el.update();
    expect(el).toMatchSnapshot();
  });

  it('should stop calling getLegalReferral, clearInterval and set errorState if a 404 is being returned at the 6th attempt', () => {
    const instance = el.instance();
    el.setProps({
      ...props,
      errorStatus: 404,
    });
    jest.runTimersToTime(80000);
    expect(instance.tries).toBe(6);
    expect(el.state().error).toBeTruthy();
    expect(props.getLegalReferral).toHaveBeenCalledTimes(7);
    expect(instance.interval).toBe(undefined);
    el.update();
    expect(el).toMatchSnapshot();
  });

  it('should clearInterval on unmount', () => {
    const instance = el.instance();
    el.unmount();
    expect(instance.interval).toBe(undefined);
  });
});
