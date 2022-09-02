import React from 'react';
import { shallow } from 'enzyme';
import formSdk from '../../util/formSdk';
import { CreateLegalCaseReferralComposition } from './';

jest.mock('../../util/formSdk', () => ({
  displaySubmissionById: jest.fn(() => Promise.resolve(1)),
  overrideSubmissionId: jest.fn(),
  setFormProps: jest.fn(),
  mountToDomNode: jest.fn(),
  setFormDataAtKey: jest.fn(),
}));

describe('<CreateLegalCaseReferralComposition />', () => {
  let props;
  let formProps;
  let el;

  beforeEach(() => {
    formProps = {
      buttonLabels: {
        cancel: 'cancel',
        continue: 'continue',
        next: 'next',
        previous: 'previous',
        submit: 'submit',
      },
      onCancel: () => {},
      onSuccessfulSubmit: () => {},
    };
    props = {
      clearSubmissions: jest.fn(),
      createSubmission: jest.fn(),
      formError: 'Form error',
      formProps,
      generateNewSubmissionId: jest.fn(),
      updatePageHeader: jest.fn(),
      setFormRendered: jest.fn(),
      arrearsId: 'here is an arrears idqw',
      newLegalReferralId: 'hi-im-a-uuid',
      systemUserId: 'ABC123',
    };

    el = shallow(<CreateLegalCaseReferralComposition {...props} />);
  });

  it('should render the page correctly', () => {
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly while loading', () => {
    el.setProps({ loading: true });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly with an error', () => {
    el.setProps({ error: true });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly with a lastSubmissionId', () => {
    el.setProps({ lastSubmissionId: 'DEF456', submissionId: null });
    expect(el).toMatchSnapshot();
  });

  it('should update the header', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should clear submissions', () => {
    expect(props.clearSubmissions).toHaveBeenCalled();
  });

  it('should generate a new submissionId if lastSubmissionId and no submissionId exists', () => {
    el.setProps({ lastSubmissionId: 'DEF456', submissionId: null, referralFormName: 'foo' });
    expect(props.generateNewSubmissionId).toHaveBeenCalled();
  });

  it('should create a submission if referralFormName and no submissionId exists', () => {
    el.setProps({ referralFormName: 'foo' });
    expect(props.createSubmission).toHaveBeenCalled();
  });

  it('should create set form props and render form when there is a submissionId', () => {
    el.setProps({ lastSubmissionId: 'DEF456', submissionId: 'abc123', arrearsId: 'arrears-id' });
    expect(formSdk.setFormProps).toHaveBeenCalledWith(formProps);
    expect(formSdk.mountToDomNode).toHaveBeenCalledWith();
    expect(formSdk.displaySubmissionById).toHaveBeenCalledWith('DEF456');
  });
});
