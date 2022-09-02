import False from 'ramda/src/F';
import True from 'ramda/src/T';
import inc from 'ramda/src/inc';
import always from 'ramda/src/always';
import compose from 'ramda/src/compose';
import curry from 'ramda/src/curry';
import evolve from 'ramda/src/evolve';
import propEq from 'ramda/src/propEq';
import propOr from 'ramda/src/propOr';
import reject from 'ramda/src/reject';
import prop from 'ramda/src/prop';
import uuid from 'uuid/v4';
import { deepTransform } from 'nhh-styles';

import { documentsApi } from '../../api';

// actions
// // upload
export const ADD_PENDING_MEDIA_UPLOAD = 'media/ADD_PENDING_MEDIA_UPLOAD';
export const REMOVE_PENDING_MEDIA_UPLOAD = 'media/REMOVE_PENDING_MEDIA_UPLOAD';
export const IS_UPLOADING_MEDIA_FILE = 'media/IS_UPLOADING_MEDIA_FILE';
export const MEDIA_FILE_UPLOAD_SUCCESS = 'media/MEDIA_FILE_UPLOAD_SUCCESS';
export const MEDIA_FILE_UPLOAD_ERROR = 'media/MEDIA_FILE_UPLOAD_ERROR';
export const CLEAR_MEDIA_STATE = 'media/CLEAR_MEDIA_STATE';
// // download
export const DOWNLOADING_FILES = 'media/DOWNLOADING_FILES';
export const DOWNLOADING_FILES_ERROR = 'media/DOWNLOADING_FILES_ERROR';
export const SET_DOWNLOADED_FILES = 'media/SET_DOWNLOADED_FILES';
export const INVALIDATE_DOWNLOADED_FILES = 'media/INVALIDATE_DOWNLOADED_FILES';

export const initialState = {
  pendingFiles: [],
  hasFileUploadErrors: false,
  downloadedFiles: [],
  downloadError: null,
  loading: false,
  loaded: false,
};

/* a helper function to set media file state. it will receive a predicate,
  by which it will determine wich file to transform / update. it will
  then receive a transformation function to be run on that item
  and finally a collection. in this case, the files array.
*/
const updateMediaFileState = curry((id, transform, collection) =>
  deepTransform([propEq('id', id)], transform, collection)
);

// a helper function to generate a default state for each pending file
const getMediaFileDefaultState = file => ({
  // adding a unique ID to each file, for better manipulation later on
  id: uuid(),
  src: file,
  retryTimes: 0,
  errorText: null,
  isUploading: false,
  hasBeenUploaded: false,
  hasUploadError: false,
});

const checkFileUploadErrors = newState => {
  if (newState.pendingFiles) {
    return {
      ...newState,
      hasFileUploadErrors: newState.pendingFiles.some(file => file.hasUploadError),
    };
  }
  return newState;
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_PENDING_MEDIA_UPLOAD:
      return {
        ...state,
        pendingFiles: propOr([], 'pendingFiles', state).concat(
          payload.map(getMediaFileDefaultState)
        ),
      };

    case IS_UPLOADING_MEDIA_FILE:
      return evolve({
        pendingFiles: updateMediaFileState(
          payload.id,
          evolve({
            retryTimes: inc,
            isUploading: True,
            hasBeenUploaded: False,
          })
        ),
      })(state);

    case MEDIA_FILE_UPLOAD_SUCCESS:
      return evolve({
        pendingFiles: updateMediaFileState(
          payload.id,
          evolve({
            isUploading: False,
            hasBeenUploaded: True,
            hasUploadError: False,
          })
        ),
      })(state);

    case MEDIA_FILE_UPLOAD_ERROR:
      return evolve({
        pendingFiles: updateMediaFileState(
          payload.file.id,
          evolve({
            errorText: always(payload.error),
            isUploading: False,
            hasBeenUploaded: False,
            hasUploadError: True,
          })
        ),
      })(state);

    case REMOVE_PENDING_MEDIA_UPLOAD: {
      return evolve({
        pendingFiles: reject(propEq('id', payload.id)),
      })(state);
    }

    case CLEAR_MEDIA_STATE:
      return {
        ...state,
        pendingFiles: [],
        hasFileUploadErrors: false,
      };

    case DOWNLOADING_FILES: {
      return {
        ...state,
        downloadedFiles: [],
        downloadError: null,
        loading: true,
        loaded: false,
      };
    }

    case INVALIDATE_DOWNLOADED_FILES: {
      return {
        ...state,
        downloadedFiles: [],
        downloadError: null,
        loading: false,
        loaded: false,
      };
    }
    case DOWNLOADING_FILES_ERROR: {
      return {
        ...state,
        downloadedFiles: [],
        downloadError: payload,
        loading: false,
        loaded: true,
      };
    }

    case SET_DOWNLOADED_FILES: {
      return {
        ...state,
        downloadedFiles: payload,
        downloadError: null,
        loading: false,
        loaded: true,
      };
    }

    default:
      return state;
  }
};

// A reducer has a post-run function attached, that will check
// if there are any upload errors, after every single
// action. Just a shortcut to keep actions clean.
export default compose(checkFileUploadErrors, reducer);

export const addPendingUploadFiles = files => ({
  type: ADD_PENDING_MEDIA_UPLOAD,
  payload: files,
});

export const removePendingUploadFile = file => ({
  type: REMOVE_PENDING_MEDIA_UPLOAD,
  payload: file,
});

export const isUploadingMediaFile = file => ({
  type: IS_UPLOADING_MEDIA_FILE,
  payload: file,
});

export const mediaFileUploadSuccess = file => ({
  type: MEDIA_FILE_UPLOAD_SUCCESS,
  payload: file,
});

export const mediaFileUploadError = (file, error) => ({
  type: MEDIA_FILE_UPLOAD_ERROR,
  payload: {
    file,
    error,
  },
});

export const clearMediaState = () => ({
  type: CLEAR_MEDIA_STATE,
});

export const retrievingFiles = () => ({
  type: DOWNLOADING_FILES,
});

export const invalidateDownloadedFiles = () => ({
  type: INVALIDATE_DOWNLOADED_FILES,
});

export const setDownloadedFilesError = payload => ({
  type: DOWNLOADING_FILES_ERROR,
  payload,
});

export const setDownloadedFiles = payload => ({
  type: SET_DOWNLOADED_FILES,
  payload,
});

// this obejct is a mapping to available methods
// on documentsApi, to access them dynamically
const MEDIA_TYPES = {
  'payment-plan': 'uploadActivityFile',
  correspondence: 'uploadCorrespondenceFile',
  interaction: 'uploadActivityFile',
  note: 'uploadNoteFile',
};

export const uploadMediaFile = curry((type, id, file) => async dispatch => {
  const methodToCall = MEDIA_TYPES[type];
  if (!methodToCall || !documentsApi[methodToCall]) {
    throw new Error('Could not resolve the method to call on documents API');
  }
  dispatch(isUploadingMediaFile(file));
  try {
    const formData = new FormData();
    formData.append('file', file.src);
    await documentsApi[methodToCall](id, formData);
    dispatch(mediaFileUploadSuccess(file));
    return true;
  } catch (e) {
    let errorMsg = '';
    if (e.failures) {
      errorMsg = e.failures.map(prop('message')).join('\n');
    }
    dispatch(mediaFileUploadError(file, errorMsg));
    return false;
  }
});

export const getFilesByCaseId = id => async dispatch => {
  dispatch(retrievingFiles());
  try {
    const { data } = await documentsApi.getCaseDocuments(id);
    dispatch(setDownloadedFiles(data));
  } catch (err) {
    const error = err.response || {};
    dispatch(setDownloadedFilesError(error.status));
  }
};
