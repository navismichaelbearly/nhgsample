import { mergeProps, mapStateToProps } from './connect';
import state from '../../../__mocks__/state';
import * as mediaActions from '../../ducks/media';

const mockState = state();

describe('MediaUploader connect', () => {
  let stateProps;
  let ownProps;

  beforeEach(() => {
    ownProps = {
      match: {
        params: {
          arrearsId: '123',
          type: 'interaction',
          id: '123',
        },
      },
      location: {
        search: {
          redirectTo: '/',
        },
      },
      history: {
        push: jest.fn(),
      },
    };
  });

  describe('mapStateToProps', () => {
    it('should generate correct props', () => {
      const { heading } = mockState.dictionary.media;

      expect(mapStateToProps(mockState, ownProps)).toEqual({
        acceptedFileExtensions:
          '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.jpg,.png,.rtf,.htm,.html,.msg,.eml,.mht,.ics,.csv,.oft',
        maxFiles: 10,
        maxFileSizeBytes: 1024 * 1024 * 20,
        media: {
          pendingFiles: [],
          hasFileUploadErrors: false,
          downloadedFiles: [],
          downloadError: null,
          loading: false,
          loaded: false,
        },
        canAddMultipleFiles: true,
        dictionary: {
          errorText: 'An error has occured when uploading the files below',
          labelText: 'Attach documents',
          removeButtonLabel: 'Remove this local file',
          retryButtonLabel: 'Retry',
          submitLabel: 'Continue',
          text: 'Choose file to upload',
          uploadSuccessMessage: 'Upload successful',
          paragraphAttach:
            'Select a file and press continue to attach a document to this interaction.',
          paragraphContinue: 'Otherwise press continue to proceed without adding documents.',
        },
        mediaUploaderHeading: heading,
        breadcrumb: expect.any(Array),
        redirect: expect.any(Function),
      });
    });

    describe('mergeProps', () => {
      const dispatchProps = {
        dispatch: jest.fn(),
      };

      let props;

      beforeEach(() => {
        stateProps = mapStateToProps(mockState, ownProps);
        props = mergeProps(stateProps, dispatchProps, ownProps);
      });

      afterEach(() => {
        jest.resetAllMocks();
      });

      it('should generete the correct props', () => {
        const {
          breadcrumb,
          media,
          mediaUploaderHeading,
          canAddMultipleFiles,
          redirect,
          ...restStateProps
        } = stateProps;
        const { match, ...restOwnProps } = ownProps;
        expect(props).toEqual({
          ...restOwnProps,
          ...restStateProps,
          ...media,
          multiple: true,
          updatePageHeader: expect.any(Function),
          clearMediaState: expect.any(Function),
          onChange: expect.any(Function),
          onRemove: expect.any(Function),
          onRetry: expect.any(Function),
          onSubmit: expect.any(Function),
        });
      });

      it('should perform correct action for clearMediaState', () => {
        props.clearMediaState();
        expect(dispatchProps.dispatch).toHaveBeenCalled();
      });

      it('should perform correct action for onChange', () => {
        props.onChange();
        expect(dispatchProps.dispatch).toHaveBeenCalled();
      });

      it('should first clear media state when type is note and multiple files cannot be uploaded', () => {
        const newProps = mergeProps(
          { ...stateProps, canAddMultipleFiles: false },
          dispatchProps,
          ownProps
        );

        const file = { name: 'hello' };
        newProps.onChange(file);

        expect(dispatchProps.dispatch).toHaveBeenCalledWith({
          type: mediaActions.CLEAR_MEDIA_STATE,
        });

        expect(dispatchProps.dispatch).toHaveBeenCalledWith({
          type: mediaActions.ADD_PENDING_MEDIA_UPLOAD,
          payload: file,
        });
      });

      it('should perform correct action for onRetry', () => {
        props.onRetry();
        expect(dispatchProps.dispatch).toHaveBeenCalled();
      });

      it('should perform correct action for onRemove', () => {
        props.onRemove();
        expect(dispatchProps.dispatch).toHaveBeenCalled();
      });

      it('should perform correct action for onSubmit', () => {
        props.onSubmit();
        expect(ownProps.history.push).toHaveBeenCalled();
      });
    });
  });
});
