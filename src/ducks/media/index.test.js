import reducer, {
  addPendingUploadFiles,
  clearMediaState,
  initialState,
  isUploadingMediaFile,
  mediaFileUploadError,
  mediaFileUploadSuccess,
  removePendingUploadFile,
  uploadMediaFile,
  invalidateDownloadedFiles,
  retrievingFiles,
  setDownloadedFilesError,
  setDownloadedFiles,
  getFilesByCaseId,
  DOWNLOADING_FILES,
  SET_DOWNLOADED_FILES,
  DOWNLOADING_FILES_ERROR,
} from './';

import { documentsApi } from '../../api';

const FileObject = {
  name: 'hello',
};

jest.mock('uuid/v4', () => () => 'some-id');
jest.mock('../../api', () => ({
  documentsApi: {
    uploadActivityFile: id =>
      id === 'fail' ? Promise.reject({ message: 'oh no' }) : Promise.resolve('good stuff'),
    getCaseDocuments: jest.fn(id =>
      id === 'fail' ? Promise.reject({ response: { status: 500 } }) : { data: { id, bar: 'baz' } }
    ),
  },
}));

describe('media reducer', () => {
  it('should set a default state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should add pending upload files', () => {
    const newState = reducer({}, addPendingUploadFiles([FileObject]));
    expect(newState).toEqual({
      hasFileUploadErrors: false,
      pendingFiles: [
        {
          id: 'some-id',
          retryTimes: 0,
          src: FileObject,
          hasBeenUploaded: false,
          isUploading: false,
          errorText: null,
          hasUploadError: false,
        },
      ],
    });
  });

  it('should change media file state to isUploading and increment retryTimes', () => {
    const initial = reducer({}, addPendingUploadFiles([FileObject]));
    const updatedState = reducer(initial, isUploadingMediaFile(initial.pendingFiles[0]));

    expect(updatedState.pendingFiles[0].isUploading).toBeTruthy();
    expect(updatedState.pendingFiles[0].retryTimes).toBe(1);
  });

  it('should remove pending upload file', () => {
    const initial = reducer({}, addPendingUploadFiles([FileObject]));
    const updatedState = reducer(initial, removePendingUploadFile(initial.pendingFiles[0]));

    expect(updatedState.pendingFiles.length).toEqual(0);
  });

  it('should change media file state to hasBeenUploaded', () => {
    const initial = reducer({}, addPendingUploadFiles([FileObject]));
    const updatedState = reducer(initial, mediaFileUploadSuccess(initial.pendingFiles[0]));

    expect(updatedState.pendingFiles[0].hasBeenUploaded).toBeTruthy();
  });

  describe('hasUploadError', () => {
    const error = 'Error, mate';
    const initial = reducer({}, addPendingUploadFiles([FileObject]));
    const updatedState = reducer(initial, mediaFileUploadError(initial.pendingFiles[0], error));

    it('should change media file state to hasUploadError', () => {
      expect(updatedState.pendingFiles[0].hasUploadError).toBeTruthy();
      expect(updatedState.pendingFiles[0].errorText).toEqual(error);
    });

    it('should set hasFileUploadErrors if there are ANY file upload errros', () => {
      expect(updatedState.hasFileUploadErrors).toEqual(true);
    });

    it('should reset hasFileUploadErrors when errors are resolved', () => {
      const fixedErrorState = reducer(
        updatedState,
        mediaFileUploadSuccess(initial.pendingFiles[0])
      );
      expect(fixedErrorState.hasFileUploadErrors).toEqual(false);
    });
  });

  it('should clear the uploading state', () => {
    const someState = { hello: 'world' };
    expect(reducer(someState, clearMediaState())).toEqual({
      hasFileUploadErrors: false,
      hello: 'world',
      pendingFiles: [],
    });
  });

  it('should change the state when downloading', () => {
    const someState = { hello: 'world' };
    expect(reducer(someState, retrievingFiles())).toEqual({
      downloadError: null,
      downloadedFiles: [],
      hello: 'world',
      loaded: false,
      loading: true,
    });
  });

  it('should set an error when download fails', () => {
    const someState = { hello: 'world' };
    expect(reducer(someState, setDownloadedFilesError(500))).toEqual({
      downloadError: 500,
      downloadedFiles: [],
      hello: 'world',
      loading: false,
      loaded: true,
    });
  });

  it('should clear the downloading state', () => {
    const someState = { hello: 'world' };
    expect(reducer(someState, invalidateDownloadedFiles())).toEqual({
      downloadError: null,
      downloadedFiles: [],
      loaded: false,
      loading: false,
      hello: 'world',
    });
  });

  it('should set downloaded files', () => {
    const someState = { hello: 'world' };
    expect(reducer(someState, setDownloadedFiles([{ bar: 'foo' }]))).toEqual({
      downloadError: null,
      downloadedFiles: [{ bar: 'foo' }],
      hello: 'world',
      loading: false,
      loaded: true,
    });
  });

  describe('Upload media file', () => {
    let dispatch;

    beforeEach(() => {
      dispatch = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an error if a wrong media type is passed', async () => {
      let message;
      try {
        await uploadMediaFile('someCrazyType', 2, { name: 'Some file' })(dispatch);
      } catch (e) {
        message = e.message;
      }
      expect(message).toEqual('Could not resolve the method to call on documents API');
    });
  });

  describe('retrieve list of files', () => {
    let dispatch;

    beforeEach(() => {
      dispatch = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('performs the correct actions when retrieving files', async () => {
      await getFilesByCaseId(123)(dispatch);
      expect(dispatch).toBeCalledWith({ type: DOWNLOADING_FILES });
      expect(documentsApi.getCaseDocuments).toBeCalledWith(123);
      expect(dispatch).toBeCalledWith({
        payload: { bar: 'baz', id: 123 },
        type: SET_DOWNLOADED_FILES,
      });
    });

    it('dispatch an error when the api fails', async () => {
      await getFilesByCaseId('fail')(dispatch);
      expect(dispatch).toBeCalledWith({ type: DOWNLOADING_FILES });
      expect(documentsApi.getCaseDocuments).toBeCalledWith('fail');
      expect(dispatch).toBeCalledWith({
        payload: 500,
        type: DOWNLOADING_FILES_ERROR,
      });
    });
  });
});
