import path from 'ramda/src/path';
import React from 'react';
import { shallow } from 'enzyme';

import { EMAIL, LETTER, SMS } from '../../constants/correspondenceSendingMethods';
import Dictionary from '../../constants/dictionary';
import GenerateCorrespondence, { getRegexFromRegexLiteral } from './GenerateCorrespondence';

const dictionary = Dictionary();

const fakeEvent = { preventDefault: () => {} };

function sel(id) {
  return `[data-state-key="${id}"]`;
}

const submitGenerateCorrespondence = el => {
  el.find(sel('generateDraftCorrespondenceButton')).props().onClick(fakeEvent);
  el.update();
};

const updateFormInput = (el, key, val) => {
  el.find(sel(key))
    .props()
    .onChange({ target: { value: val } });
  el.update();
};
const testStaticFormInputs = (el, key, val) => {
  updateFormInput(el, key, val);
  expect(el.state().staticFields[key]).toEqual(val);
};

const testRequiredStaticFieldError = (el, key) => {
  submitGenerateCorrespondence(el);
  expect(el.find(sel(key)).props().error).toBeTruthy();
};

const defaultProps = {
  arrearsId: 'arrearId',
  chosenTemplateName: 'Some template',
  closeTemplate: () => {},
  dataBddPrefix: 'dataBddPrefix',
  errorText: path(['correspondence', 'errorText'], dictionary),
  generateDraft: () => {},
  generatePreviewSubmitText: 'Generate Draft Correspondance',
  labels: path(['correspondence', 'labels'], dictionary),
  openTemplate: () => {},
  recipient: 'Third party',
  retriableError: false,
  sendingMethod: LETTER,
  substitutionFields: [
    {
      description: 'merge1',
      key: 'merge1',
      label: 'Label 1',
      mandatory: false,
      validation: '/[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/i',
    },
  ],
  templateId: 'templateId',
  templatePreviewImage: 'templatePreviewImage',
  validateHandler: jest.fn(),
};

const render = props => shallow(<GenerateCorrespondence {...defaultProps} {...props} />);

describe('<GenerateCorrespondence />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page with the default props', () => {
    const el = render();
    expect(el).toMatchSnapshot();
  });

  it('should be able to generate a valid regex from a regex-string ', () => {
    const regexString = '/[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/i';
    expect(getRegexFromRegexLiteral(regexString)).toEqual(/[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/i);
  });

  it('should be able to generate a valid regex from a regex-pattern ', () => {
    const regexString = '[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)';
    expect(getRegexFromRegexLiteral(regexString)).toEqual(/[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/);
  });

  it('should call openTemplate with the correct params when view template is clicked on', () => {
    const openTemplate = jest.fn();
    const el = render({ openTemplate });
    el.find(sel('previewLink')).props().onClick();
    expect(openTemplate).toHaveBeenCalled();
    expect(openTemplate.mock.calls[0][0]).toMatchSnapshot();
  });

  describe('mergeFields', () => {
    it('should update the local state when an input changes', () => {
      const el = render({ substitutionFields: defaultProps.substitutionFields });
      const newVal = 'newVal';
      const testKey = defaultProps.substitutionFields[0].key;
      el.find(sel(testKey))
        .props()
        .onChange({ target: { value: newVal } });
      expect(el.state().mergeFields[testKey]).toEqual(newVal);
    });
  });

  describe('staticFields', () => {
    it('should render the correct form elements for Letter', () => {
      const el = render({ sendingMethod: LETTER });
      expect(el.find(sel('addressLine1')).exists()).toBe(true);
      expect(el.find(sel('addressLine2')).exists()).toBe(true);
      expect(el.find(sel('addressLine3')).exists()).toBe(true);
      expect(el.find(sel('city')).exists()).toBe(true);
      expect(el.find(sel('postCode')).exists()).toBe(true);
    });
    it('should render the correct form elements for Email', () => {
      const el = render({ sendingMethod: EMAIL });
      expect(el.find(sel('email')).exists()).toBe(true);
    });
    it('should render the correct form elements for Sms', () => {
      const el = render({ sendingMethod: SMS });
      expect(el.find(sel('mobilePhone')).exists()).toBe(true);
    });

    it('form elements should update the local state when LETTER is the sending method', () => {
      const el = render({ sendingMethod: LETTER });

      testStaticFormInputs(el, 'addressLine1', 'val');
      testStaticFormInputs(el, 'addressLine2', 'val');
      testStaticFormInputs(el, 'addressLine3', 'val');
      testStaticFormInputs(el, 'city', 'val');
      testStaticFormInputs(el, 'postCode', 'val');
    });

    it('form elements should update the local state when EMAIL is the sending method', () => {
      const el = render({ sendingMethod: EMAIL });
      testStaticFormInputs(el, 'email', 'val');
    });

    it('form elements should update the local state when SMS is the sending method', () => {
      const el = render({ sendingMethod: SMS });
      testStaticFormInputs(el, 'mobilePhone', 'val');
    });
  });

  describe('on Generate Draft Correspondence', () => {
    describe('Static fields error validations', () => {
      // LETTER
      it('should show an error when addressLine1 is missing', () => {
        const el = render({ sendingMethod: LETTER });
        testRequiredStaticFieldError(el, 'addressLine1');
      });

      it('should show an error when city is missing', () => {
        const el = render({ sendingMethod: LETTER });
        testRequiredStaticFieldError(el, 'city');
      });

      it('should show an error when postCode is missing', () => {
        const el = render({ sendingMethod: LETTER });
        testRequiredStaticFieldError(el, 'postCode');
      });
      // EMAIL
      it('should show an error when email is missing', () => {
        const el = render({ sendingMethod: EMAIL });
        testRequiredStaticFieldError(el, 'email');
      });
      // SMS
      it('should show an error when mobilePhone is missing', () => {
        const el = render({ sendingMethod: SMS });
        testRequiredStaticFieldError(el, 'mobilePhone');
      });
    });
    describe('Merge fields error validations', () => {
      it('should set the correct error when a mandatory merge field was not entered', () => {
        const mergeKey = 'merge1';
        const el = render({
          substitutionFields: [
            {
              description: 'merge1',
              key: 'merge1',
              label: 'Label 1',
              mandatory: true,
            },
          ],
        });
        submitGenerateCorrespondence(el);
        expect(el.find(sel(mergeKey)).props().error).toBeTruthy();
      });
    });
    it('should call passed in generateDraft when sendingMethod is letter and all validations pass', () => {
      const generateDraft = jest.fn();
      const el = render({ generateDraft });
      updateFormInput(el, 'addressLine1', 'val');
      updateFormInput(el, 'addressLine2', 'val');
      updateFormInput(el, 'addressLine3', 'val');
      updateFormInput(el, 'city', 'val');
      updateFormInput(el, 'postCode', 'val');
      submitGenerateCorrespondence(el);
      expect(generateDraft).toHaveBeenCalled();
      expect(generateDraft.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should call passed in generateDraft when sendingMethod is email and all validations pass', () => {
      const generateDraft = jest.fn();
      const el = render({ generateDraft, sendingMethod: EMAIL });
      updateFormInput(el, 'email', 'test@email.com');
      submitGenerateCorrespondence(el);
      expect(generateDraft).toHaveBeenCalled();
      expect(generateDraft.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should call passed in generateDraft when sendingMethod is sms and all validations pass', () => {
      const generateDraft = jest.fn();
      const el = render({ generateDraft, sendingMethod: SMS });
      updateFormInput(el, 'mobilePhone', '07566767635');
      submitGenerateCorrespondence(el);
      expect(generateDraft).toHaveBeenCalled();
      expect(generateDraft.mock.calls[0][0]).toMatchSnapshot();
    });
  });

  it('should disable the Generate Draft button when generatePreviewLoading is loading', () => {
    const el = render({ generatePreviewLoading: true });
    expect(el.find(sel('generateDraftCorrespondenceButton')).props().disabled).toBe(true);
  });

  it('should disable the form with a successful submit', () => {
    const generateDraft = jest.fn();
    const el = render({ generateDraft, recipient: 'Customer', sendingMethod: SMS });
    updateFormInput(el, 'mobilePhone', '07566767635');
    submitGenerateCorrespondence(el);
    expect(generateDraft).toHaveBeenCalled();
    expect(generateDraft.mock.calls[0][0]).not.toHaveProperty('thirdParty');
    expect(el.instance().disableForm()).toBeTruthy();
  });

  it('should not disable Generate Preview Draft button if it been submitted but there is a retriableError', () => {
    const el = render({ retriableError: true });
    el.setState({ formSubmitted: true });
    el.update();
    expect(el.find(sel('generateDraftCorrespondenceButton')).prop('disabled')).toBe(false);
  });

  it('should disable Generate Preview Draft button if it been submitted and there isnt a retriableError', () => {
    const el = render({ retriableError: false });
    el.setState({ formSubmitted: true });
    el.update();
    expect(el.find(sel('generateDraftCorrespondenceButton')).prop('disabled')).toBe(true);
  });

  it('should not add thirdParty when recipient is Customer', () => {
    const generateDraft = jest.fn();
    const el = render({ generateDraft, recipient: 'Customer', sendingMethod: SMS });
    updateFormInput(el, 'mobilePhone', '07566767635');
    submitGenerateCorrespondence(el);
    expect(generateDraft).toHaveBeenCalled();
    expect(generateDraft.mock.calls[0][0]).not.toHaveProperty('thirdParty');
  });
});
