import { NotificationPanel } from 'nhh-styles';
import path from 'ramda/src/path';
import React from 'react';
import { shallow } from 'enzyme';
import { FormWrapper } from '../../components';

import Attachments from './Attachments';

import Dictionary from '../../constants/dictionary';
import { CustomiseCorrespondenceCompositions } from './';
import { LETTER, EMAIL, SMS } from '../../constants/correspondenceSendingMethods';
import { CUSTOMER, THIRD_PARTY } from '../../constants/correspondenceRecipients';

jest.mock('date-fns/start_of_today', () => () => new Date('2018-08-01'));

const dictionary = Dictionary();

function sel(id) {
  return `[data-state-key="${id}"]`;
}

const defaultProps = {
  arrearsId: '123123',
  attachmentProps: {
    acceptedFileExtensions: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.jpg,.png',
    downloadFile: jest.fn(),
    pendingFiles: [],
    downloadedFiles: [],
    clearMediaState: jest.fn(),
    getFilesByCaseId: jest.fn(),
    handleFilesChange: jest.fn(),
    hasGeneratedCorrespondence: false,
    mandatoryAttachments: [],
    maxFiles: 10,
    maxFileSize: 20971520,
    onChange: jest.fn(),
    onRemove: jest.fn(),
    onRetry: jest.fn(),
    dictionary: {
      attachCaseFile: 'attachCaseFileSample',
      genericErrorMessage: 'genericErrorMessageSample',
      labelText: 'labelTextSample',
      mandatoryAttachment: 'mandatoryAttachmentSample',
      mandatoryAttachmentLabel: 'mandatoryAttachmentLabelSample',
      mandatoryAttachmentParagraph: 'mandatoryAttachmentParagraphSample',
      removeButtonLabel: 'removeButtonLabelSample',
      removeCaseFile: 'removeCaseFileSample',
      retryButtonLabel: 'retryButtonLabelSample',
      text: 'textSample',
      uploadSuccessMessage: 'uploadSuccessMessageSample',
    },
    selectedCaseFiles: [],
  },
  discard: jest.fn(),
  chosenTemplateName: 'Some template',
  closeTemplate: jest.fn(),
  correspondenceId: '',
  errorText: path(['correspondence', 'errorText'], dictionary),
  generateDraft: () => {},
  generatePreviewError: false,
  generatePreviewLoading: false,
  generatePreviewSubmitText: 'Generate Draft Correspondance',
  genericContactITErrorText:
    'We have encountered an issue whilst trying to retrieve this information. If the issue persists, contact your IT team',
  getSubstitutionFields: jest.fn(),
  labels: path(['correspondence', 'labels'], dictionary),
  onBack: jest.fn(),
  onSubmit: jest.fn(),
  onUnmount: jest.fn(),
  openTemplate: jest.fn(),
  printerOptions: [
    {
      friendlyName: 'A printing option',
      id: '96e93dec-2558',
    },
  ],
  recipient: 'Customer',
  redirectToSendCorrespondence: jest.fn(),
  sendingMethod: '',
  isLoading: false,
  hasMediaErrors: false,
  substitutionFields: [
    {
      description: 'Some description',
      key: 'mergefield1',
      label: 'Some label',
      mandatory: true,
      validation: "/^[a-z ,.'-]+$/i",
    },
    {
      description: 'Some description',
      key: 'mergefield2',
      label: 'Some label',
      mandatory: true,
      validation: "/^[a-z ,.'-]+$/i",
    },
  ],
  templateId: '',
  templatePreviewImage: 'templatePreview',
  updatePageHeader: jest.fn(),
};

const correspondenceDocuments = [
  {
    content: 'JVBERi0xLjUNCjQgMCBvYmoNCjw8L1R5cGUgL1BhZ2UvUGFyZW',
    encodingType: 'Pdf',
    errorMessages: { failures: null },
    id: 'asdasd213123',
    loading: false,
    recipientName: 'recipient name',
    sendingMethod: 'Post',
    status: 'Success',
    type: 'Letter',
  },
];

const render = props =>
  shallow(<CustomiseCorrespondenceCompositions {...defaultProps} {...props} />);

describe('<CustomiseCorrespondenceCompositions />', () => {
  const preventDefault = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call updatePageHeader', () => {
    const updatePageHeader = jest.fn();
    render({ updatePageHeader });
    expect(updatePageHeader).toHaveBeenCalled();
  });

  it('should call getSubstitutionFields when templateId and correspondenceId are specified', () => {
    const getSubstitutionFields = jest.fn();
    const templateId = 'templateId';
    const correspondenceId = 'correspondenceId';
    render({ correspondenceId, templateId, getSubstitutionFields });
    expect(getSubstitutionFields).toHaveBeenCalledWith(templateId);
  });

  it('should call redirectToSendCorrespondence if templateId or correspondenceId dont exist', () => {
    const correspondenceId = '';
    const redirectToSendCorrespondence = jest.fn();
    const templateId = '';
    render({ correspondenceId, redirectToSendCorrespondence, templateId });
    expect(redirectToSendCorrespondence).toHaveBeenCalled();
  });

  it('should show a warning when there are no printer options', () => {
    const wrapper = render({
      correspondenceDocuments,
      printerOptions: [],
      sendingMethod: LETTER,
    });
    expect(wrapper.find(NotificationPanel).exists()).toBe(true);
  });

  it('should show a list of printing options', () => {
    const wrapper = render({
      correspondenceDocuments,
      sendingMethod: LETTER,
    });
    expect(wrapper.find(sel('printingOption'))).toMatchSnapshot();
  });

  it('should show Attachments component, if sendingMethod is either EMAIL or LETTER', () => {
    [LETTER, EMAIL].forEach(method => {
      const wrapper = render({
        correspondenceDocuments,
        sendingMethod: method,
      });

      expect(wrapper.find(Attachments)).toExist();
    });

    const wrapper = render({
      correspondenceDocuments,
      sendingMethod: SMS,
    });

    expect(wrapper.find(Attachments)).not.toExist();
  });

  describe('Form validations', () => {
    const submitForm = currentEl =>
      currentEl.find(FormWrapper).props().handleFormSubmit({ preventDefault });

    describe('Validation AND SUBMIT when all documents HAVE NOT been previwed', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'abc123',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Email',
          },
          {
            errorType: null,
            id: 'def456',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Email',
          },
        ],
        sendingMethod: 'Email',
        hasMediaErrors: false,
        fatalError: false,
        recipient: CUSTOMER,
        substitutionFields: [],
      });
      wrapper.setState({ documentsPreviewed: ['def456'] });

      it('should have Submit button disabled', () => {
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe('Validation AND SUBMIT when all documents HAVE been previewed', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'abc123',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Email',
          },
          {
            errorType: null,
            id: 'def456',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Email',
          },
        ],
        sendingMethod: 'Email',
        hasMediaErrors: false,
        fatalError: false,
        recipient: CUSTOMER,
        substitutionFields: [],
      });
      wrapper.setState({ documentsPreviewed: ['def456', 'abc123'] });

      it('should have Submit button active', () => {
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({ exstingDocumentUrlsToAttach: [] });
      });
    });

    describe('Customer validation AND SUBMIT when there are no substitutions', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'cddd8bb3-c8f3-e811-80d3-005056825b41',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Email',
          },
        ],
        sendingMethod: 'Email',
        hasMediaErrors: false,
        fatalError: false,
        recipient: CUSTOMER,
        substitutionFields: [],
      });
      wrapper.setState({ documentsPreviewed: ['cddd8bb3-c8f3-e811-80d3-005056825b41'] });

      it('should have Submit button active', () => {
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({ exstingDocumentUrlsToAttach: [] });
      });
    });

    describe('Customer validation AND SUBMIT when there are substitutions', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'cddd8bb3-c8f3-e811-80d3-005056825b41',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Post',
          },
        ],
        sendingMethod: '',
        hasMediaErrors: false,
        fatalError: false,
        recipient: CUSTOMER,
        substitutionFields: [
          {
            description: 'Current contact details',
            key: 'mergefield1',
            label: 'Current contact details',
            mandatory: true,
            validation: "/^[a-z ,.'-]+$/i",
          },
        ],
      });
      wrapper.setState({
        printingOption: 'A printing option',
        documentsPreviewed: ['cddd8bb3-c8f3-e811-80d3-005056825b41'],
      });

      it('should have Submit button active', () => {
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          exstingDocumentUrlsToAttach: [],
          printer: { printerId: '96e93dec-2558' },
        });
      });
    });

    describe('Third Party SMS validation AND SUBMIT when there are no substitutions', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'cddd8bb3-c8f3-e811-80d3-005056825b41',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Email',
          },
        ],
        sendingMethod: SMS,
        hasMediaErrors: false,
        fatalError: false,
        recipient: THIRD_PARTY,
        substitutionFields: [],
      });
      wrapper.setState({ documentsPreviewed: ['cddd8bb3-c8f3-e811-80d3-005056825b41'] });

      it('should have Submit button active', () => {
        wrapper.setState({ isGenerateCorrespondenceFormValid: true }).update();
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({ exstingDocumentUrlsToAttach: [] });
      });
    });

    describe('Third Party EMAIL validation AND SUBMIT when there are no substitutions', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'cddd8bb3-c8f3-e811-80d3-005056825b41',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Email',
          },
        ],
        sendingMethod: EMAIL,
        hasMediaErrors: false,
        fatalError: false,
        recipient: THIRD_PARTY,
        substitutionFields: [],
      });
      wrapper.setState({ documentsPreviewed: ['cddd8bb3-c8f3-e811-80d3-005056825b41'] });

      it('should have Submit button active', () => {
        wrapper.setState({ isGenerateCorrespondenceFormValid: true }).update();
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({ exstingDocumentUrlsToAttach: [] });
      });
    });

    describe('Third Party EMAIL validation AND SUBMIT', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'cddd8bb3-c8f3-e811-80d3-005056825b41',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Post',
          },
        ],
        sendingMethod: EMAIL,
        hasMediaErrors: false,
        fatalError: false,
        recipient: THIRD_PARTY,
        substitutionFields: [
          {
            description: 'Current contact details',
            key: 'mergefield1',
            label: 'Current contact details',
            mandatory: true,
            validation: "/^[a-z ,.'-]+$/i",
          },
        ],
      });
      wrapper.setState({ documentsPreviewed: ['cddd8bb3-c8f3-e811-80d3-005056825b41'] });

      it('should have Submit button active', () => {
        wrapper.setState({ isGenerateCorrespondenceFormValid: true }).update();
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({ exstingDocumentUrlsToAttach: [] });
      });
    });

    describe('Third Party EMAIL validation AND SUBMIT when there are substitutions and attachments', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'cddd8bb3-c8f3-e811-80d3-005056825b41',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Post',
          },
        ],
        sendingMethod: EMAIL,
        hasMediaErrors: false,
        fatalError: false,
        recipient: THIRD_PARTY,
        substitutionFields: [
          {
            description: 'Current contact details',
            key: 'mergefield1',
            label: 'Current contact details',
            mandatory: true,
            validation: "/^[a-z ,.'-]+$/i",
          },
        ],
      });
      wrapper.setState({ documentsPreviewed: ['cddd8bb3-c8f3-e811-80d3-005056825b41'] });

      it('should have Submit button active', () => {
        wrapper
          .setState({ isGenerateCorrespondenceFormValid: true, selectedCaseFiles: ['fileURI'] })
          .update();
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          exstingDocumentUrlsToAttach: ['fileURI'],
        });
      });
    });

    describe('Third Party LETTER validation AND SUBMIT when there are substitutions and attachments', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'cddd8bb3-c8f3-e811-80d3-005056825b41',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Post',
          },
        ],
        sendingMethod: LETTER,
        hasMediaErrors: false,
        fatalError: false,
        recipient: THIRD_PARTY,
        printerOptions: [{ friendlyName: 'a printingOption choice', id: 'ID' }],
        substitutionFields: [
          {
            description: 'Current contact details',
            key: 'mergefield1',
            label: 'Current contact details',
            mandatory: true,
            validation: "/^[a-z ,.'-]+$/i",
          },
        ],
      });
      wrapper.setState({ documentsPreviewed: ['cddd8bb3-c8f3-e811-80d3-005056825b41'] });

      it('should have Submit button active', () => {
        wrapper
          .setState({
            isGenerateCorrespondenceFormValid: true,
            printingOption: 'a printingOption choice',
            selectedCaseFiles: ['fileURI'],
          })
          .update();
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          exstingDocumentUrlsToAttach: ['fileURI'],
          printer: { printerId: 'ID' },
        });
      });
    });
  });
});
