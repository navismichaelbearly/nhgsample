import React from 'react';
import { shallow } from 'enzyme';
import { MediaUploader } from './';

const FileObject = {
  id: 'some-id',
  hasBeenUploaded: false,
  isUploading: false,
  hasUploadError: false,
  errorText: null,
  src: {
    name: 'Hello',
  },
};

describe('<MediaUploader />', () => {
  let props;

  beforeEach(() => {
    props = {
      acceptedFileExtensions: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.jpg,.png',
      maxFiles: 10,
      maxFileSizeBytes: 20971520,
      pendingFiles: [],
      clearMediaState: jest.fn(),
      multiple: true,
      onChange: jest.fn(),
      onRemove: jest.fn(),
      onRetry: jest.fn(),
      onSubmit: jest.fn(),
      updatePageHeader: jest.fn(),
      dictionary: {
        submitLabel: 'Submit',
        labelText: 'Some label text',
        text: 'Awesome text',
        retryButtonLabel: 'Retry',
        uploadSuccessMessage: 'Upload successful',
        removeButtonLabel: 'Remove',
        errorText: 'There was a error',
        paragraphAttach: 'Hello',
        paragraphContinue: 'World',
      },
      history: {
        location: {},
      },
    };
  });

  it('should render correctly', () => {
    expect(shallow(<MediaUploader {...props} />)).toMatchSnapshot();
  });

  it('should render correctly with files', () => {
    props = {
      ...props,
      pendingFiles: [FileObject],
    };

    expect(shallow(<MediaUploader {...props} />)).toMatchSnapshot();
  });

  it('should render correctly with error', () => {
    props = {
      ...props,
      pendingFiles: [FileObject],
      hasUploadErrors: true,
    };

    expect(shallow(<MediaUploader {...props} />)).toMatchSnapshot();
  });

  it('should call updatePageHeader on mount', () => {
    shallow(<MediaUploader {...props} />);
    expect(props.updatePageHeader).toHaveBeenCalled();
  });
});
