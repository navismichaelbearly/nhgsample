import React from 'react';
import { shallow, mount } from 'enzyme';
import { testUtils, Pagination } from 'nhh-styles';
import Attachments from './Attachments';
import { TableWrapper, ErrorText } from './components';

describe('<Attachments />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      acceptedFileExtensions: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.jpg,.png',
      downloadFile: jest.fn(),
      selectedCaseFiles: [],
      handleFilesChange: jest.fn(),
      clearMediaState: jest.fn(),
      downloadedFiles: [],
      getFilesByCaseId: jest.fn(),
      hasGeneratedCorrespondence: true,
      hasDownloadError: false,
      mandatoryAttachments: [],
      maxFileSize: 20971520,
      maxFiles: 10,
      onChange: jest.fn(),
      onRemove: jest.fn(),
      onRetry: jest.fn(),
      pendingFiles: [],
      dictionary: {
        attachCaseFile: 'attachCaseFileSample',
        genericErrorMessage: 'Some awesome error',
        labelText: 'labelTextSample',
        mandatoryAttachment: 'This is mandatory',
        mandatoryAttachmentLabel: 'Mandatory label',
        mandatoryAttachmentParagraph: 'This paragraph is cool',
        removeButtonLabel: 'remove this',
        removeCaseFile: 'removeCaseFileSample',
        retryButtonLabel: 'retry this',
        text: 'textSample',
        uploadSuccessMessage: 'well done',
      },
    };

    el = shallow(<Attachments {...props} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when correspondence has not been generated yet', () => {
    props.hasGeneratedCorrespondence = false;
    expect(shallow(<Attachments {...props} />)).toMatchSnapshot();
  });

  it('should render correctly when correspondence has been generated', () => {
    expect(el).toMatchSnapshot();
  });

  it('should call getFilesByCaseId on mount', () => {
    expect(props.getFilesByCaseId).toHaveBeenCalled();
  });

  it('should clear media state on unmount', () => {
    el.unmount();
    expect(props.clearMediaState).toHaveBeenCalled();
  });

  it('should show error when there is a download error', () => {
    props = {
      ...props,
      hasDownloadError: true,
    };

    const mounted = mount(testUtils.withTheme(<Attachments {...props} />));
    expect(mounted.find(ErrorText)).toExist();
    expect(mounted.find(ErrorText).text()).toBe(props.dictionary.genericErrorMessage);
  });

  describe('with case files', () => {
    let newEl;

    beforeEach(() => {
      props = {
        ...props,
        selectedCaseFiles: ['thisIsAFileURI'],
        mandatoryAttachments: [{ friendlyName: 'hello' }],
        downloadedFiles: [
          { name: 'hello world', uri: '1234' },
          { name: 'hello new world', uri: '221' },
        ],
      };

      newEl = shallow(<Attachments {...props} />);
    });

    it('should update local pageSize state when pagination amends items after view more click', () => {
      newEl.setState({ pageSize: 1 });
      expect(newEl.state().pageSize).toBe(1);
      const paginationProps = newEl.find(Pagination).props();
      paginationProps.render(paginationProps.items.slice(0, 2));
      expect(newEl.state().pageSize).toBe(2);
    });

    it('should render case files table when there are mandatory files or downloaded files available', () => {
      expect(el.find(TableWrapper)).not.toExist();
      expect(newEl.find(TableWrapper)).toExist();
    });

    it('should add optional case files to the state', () => {
      expect(props.selectedCaseFiles.length).toBe(1);
      newEl.instance().addCaseFile('someCaseFile');
      expect(props.handleFilesChange).toHaveBeenCalledWith(['thisIsAFileURI', 'someCaseFile']);
    });

    it('should remove optional case files from state', () => {
      expect(props.selectedCaseFiles.length).toBe(1);
      newEl.instance().removeCaseFile('thisIsAFileURI');
      expect(props.handleFilesChange).toHaveBeenCalledWith([]);
    });
  });
});
