import path from 'ramda/src/path';
import { correspondenceApi } from '../../api';
import retryPromise from '../../util/retryPromise';

import { FailedFatal, FailedRetriable } from '../../constants/correspondenceErrorTypes';

const {
  generatePreviewCorrespondence: generatePreviewCorrespondenceApi,
  getCorrespondenceDocument: getCorrespondenceDocumentApi,
  getTemplates: getTemplatesApi,
  getTemplatesSubstitutions: getTemplatesSubstitutionsApi,
  submitCorrespondence,
  cancelCorrespondence: cancelCorrespondenceApi,
} = correspondenceApi;

// Actions
export const ENRICH_CORRESPONDENCE_DOCUMENT = 'sendCorrespondence/ENRICH_CORRESPONDENCE_DOCUMENT ';
export const GENERATE_PREVIEW_ERROR = 'sendCorrespondence/GENERATE_PREVIEW_ERROR';
export const RESET = 'sendCorrespondence/RESET';
export const SET_CORRESPONDENCE_DOCUMENTS = 'sendCorrespondence/SET_CORRESPONDENCE_DOCUMENTS';
export const SET_FORM_DATA = 'sendCorrespondence/SET_FORM_DATA';
export const SET_GENERATE_PREVIEW_LOADING = 'sendCorrespondence/SET_GENERATE_PREVIEW_LOADING';
export const SET_GENERATE_PREVIEW_SUCCESS = 'sendCorrespondence/SET_GENERATE_PREVIEW_SUCCESS';
export const SET_MANDATORY_ATTACHMENTS = 'sendCorrespondence/SET_MANDATORY_ATTACHMENTS';
export const SET_PRINTER_OPTIONS = 'sendCorrespondence/SET_PRINTER_OPTIONS';
export const SET_SUBSTITUTION_FIELDS = 'sendCorrespondence/SET_SUBSTITUTION_FIELDS';
export const SET_TEMPLATE_PREVIEW = 'sendCorrespondence/SET_TEMPLATE_PREVIEW';
export const SET_TEMPLATES = 'sendCorrespondence/SET_TEMPLATES';
export const SET_TEMPLATES_ERROR = 'sendCorrespondence/SET_TEMPLATES_ERROR';
export const TEMPLATES_LOADING = 'sendCorrespondence/TEMPLATES_LOADING';
export const TEMPLATES_SUBSTITUTIONS_LOADING = 'sendCorrespondence/TEMPLATES_SUBSTITUTIONS_LOADING';
export const LOADING = 'sendCorrespondence/LOADING';
export const ERROR = 'sendCorrespondence/ERROR';
export const SUBMITTED = 'sendCorrespondence/SUBMITTED';
export const CANCEL_ERROR = 'sendCorrespondence/CANCEL_ERROR';
export const SET_CHOSEN_TEMPLATE_NAME = 'sendCorrespondence/SET_CHOSEN_TEMPLATE_NAME';

const initialState = {
  correspondenceDocuments: [],
  generatePreviewError: false,
  generatePreviewLoading: false,
  loadingTemplates: false,
  templatesError: false,
  chosenTemplateName: '',
  loadingSubstitutions: false,
  mandatoryAttachments: [],
  printerOptions: [],
  recipient: '',
  sendingMethod: '',
  substitutionFields: [],
  template: {},
  templates: [],
  templatePreviewImage: '',
  loading: false,
  error: false,
  submitted: false,
  cancelError: null,
};

const enrichCorrespondenceDocuments = (documents, documentId, dataToEnrich) =>
  documents.map(doc =>
    doc.id === documentId
      ? {
          ...doc,
          ...dataToEnrich,
        }
      : doc
  );

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case ENRICH_CORRESPONDENCE_DOCUMENT: {
      return {
        ...state,
        correspondenceDocuments: enrichCorrespondenceDocuments(
          state.correspondenceDocuments,
          payload.id,
          payload.data
        ),
      };
    }
    case GENERATE_PREVIEW_ERROR: {
      return {
        ...state,
        generatePreviewError: true,
        generatePreviewLoading: false,
      };
    }
    case RESET: {
      return {
        ...initialState,
        templatePreviewImage: state.templatePreviewImage,
      };
    }

    case CANCEL_ERROR:
      return {
        ...state,
        cancelError: payload,
      };

    case SET_CORRESPONDENCE_DOCUMENTS: {
      return {
        ...state,
        correspondenceDocuments: payload,
      };
    }

    case SET_GENERATE_PREVIEW_LOADING: {
      return {
        ...state,
        generatePreviewLoading: payload,
      };
    }

    case SET_FORM_DATA: {
      return {
        ...state,
        recipient: payload.recipient,
        sendingMethod: payload.sendingMethod,
        template: payload.template,
      };
    }

    case SET_GENERATE_PREVIEW_SUCCESS: {
      return {
        ...state,
        generatePreviewError: false,
        generatePreviewLoading: false,
      };
    }

    case SET_PRINTER_OPTIONS: {
      return {
        ...state,
        printerOptions: payload,
      };
    }

    case SET_TEMPLATES: {
      return {
        ...state,
        loadingTemplates: false,
        templates: payload,
        templatesError: false,
      };
    }

    case SET_TEMPLATES_ERROR: {
      return {
        ...state,
        loadingTemplates: false,
        templates: [],
        templatesError: true,
      };
    }

    case SET_CHOSEN_TEMPLATE_NAME:
      return {
        ...state,
        chosenTemplateName: payload,
      };

    case SET_MANDATORY_ATTACHMENTS: {
      return {
        ...state,
        mandatoryAttachments: payload,
      };
    }

    case SET_SUBSTITUTION_FIELDS: {
      return {
        ...state,
        loadingSubstitutions: false,
        substitutionFields: payload,
      };
    }

    case SET_TEMPLATE_PREVIEW: {
      return {
        ...state,
        templatePreviewImage: payload,
      };
    }

    case TEMPLATES_LOADING: {
      return {
        ...state,
        loadingTemplates: true,
      };
    }

    case TEMPLATES_SUBSTITUTIONS_LOADING: {
      return {
        ...state,
        loadingSubstitutions: true,
      };
    }

    case LOADING: {
      return {
        ...state,
        loading: true,
        error: false,
        submitted: false,
      };
    }

    case ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
        submitted: false,
      };
    }

    case SUBMITTED: {
      return {
        ...state,
        loading: false,
        error: false,
        submitted: true,
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const enrichCorrespondenceDocument = payload => ({
  type: ENRICH_CORRESPONDENCE_DOCUMENT,
  payload,
});
export const generatePreviewError = () => ({
  type: GENERATE_PREVIEW_ERROR,
});
export const templatesLoading = () => ({
  type: TEMPLATES_LOADING,
});

export const templatesSubstitutionsLoading = () => ({
  type: TEMPLATES_SUBSTITUTIONS_LOADING,
});

export const setFormData = payload => ({
  type: SET_FORM_DATA,
  payload,
});

export const setSubstitutionFields = payload => ({
  type: SET_SUBSTITUTION_FIELDS,
  payload,
});

export const resetData = () => ({
  type: RESET,
});

export const setMandatoryAttachments = payload => ({
  type: SET_MANDATORY_ATTACHMENTS,
  payload,
});

export const setPrinterOptions = payload => ({
  type: SET_PRINTER_OPTIONS,
  payload,
});

export const setTemplates = payload => ({
  type: SET_TEMPLATES,
  payload,
});

export const setTemplatesError = payload => ({
  type: SET_TEMPLATES_ERROR,
  payload,
});

export const setTemplatePreview = payload => ({
  type: SET_TEMPLATE_PREVIEW,
  payload,
});

export const setCorrespondenceDocuments = payload => ({
  type: SET_CORRESPONDENCE_DOCUMENTS,
  payload,
});

export const setGeneratePreviewLoading = (loading = true) => ({
  type: SET_GENERATE_PREVIEW_LOADING,
  payload: loading,
});

export const setGeneratePreviewSuccess = () => ({
  type: SET_GENERATE_PREVIEW_SUCCESS,
});

export const setSubmitLoading = () => ({
  type: LOADING,
});

export const setSubmitError = () => ({
  type: ERROR,
});

export const setSubmittedSuccess = () => ({
  type: SUBMITTED,
});

export const setCancelError = e => ({
  type: CANCEL_ERROR,
  payload: e,
});

export const setChosenTemplateName = name => ({
  type: SET_CHOSEN_TEMPLATE_NAME,
  payload: name,
});

export const getTemplates = (recipient, params) => async dispatch => {
  dispatch(templatesLoading());
  try {
    const { data } = await getTemplatesApi(recipient, params);
    dispatch(setTemplates(data));
  } catch (err) {
    dispatch(setTemplatesError());
  }
};

export const getTemplatesSubstitutions = templateId => async dispatch => {
  dispatch(templatesSubstitutionsLoading());
  const { data } = await getTemplatesSubstitutionsApi(templateId);
  dispatch(setSubstitutionFields(data.substitutions));
  dispatch(setMandatoryAttachments(data.mandatoryAttachments));
  dispatch(setChosenTemplateName(data.name));
  dispatch(setPrinterOptions(path(['printerOptions', 'printerOptions'], data)));
};

export const getCorrespondenceDocument = (correspondenceId, documentId) => async dispatch => {
  try {
    const { data } = await retryPromise(
      () => getCorrespondenceDocumentApi(correspondenceId, documentId),
      {
        retryTimes: 3,
        delay: 1000,
      }
    );

    dispatch(
      enrichCorrespondenceDocument({
        id: documentId,
        data: {
          ...data.generationStatusModel,
          errorType:
            [FailedFatal, FailedRetriable].find(d => d === data.generationStatusModel.status) ||
            null,
          loading: false,
        },
      })
    );
  } catch (e) {
    dispatch(
      enrichCorrespondenceDocument({
        id: documentId,
        data: { loading: false, errorType: FailedFatal },
      })
    );
  }
};

export const cancelCorrespondence = correspondenceId => async dispatch => {
  try {
    return await cancelCorrespondenceApi(correspondenceId);
  } catch (e) {
    return dispatch(setCancelError(e));
  }
};

export const generatePreviewCorrespondence = (
  correspondenceId,
  params,
  getCorrespondenceDocumentAction
) => async dispatch => {
  try {
    dispatch(setGeneratePreviewLoading());
    const { data } = await generatePreviewCorrespondenceApi(correspondenceId, params);
    const documents = path(['documents'], data);
    // set the initial documents returned with the addition of the loading and errorType
    dispatch(
      setCorrespondenceDocuments(documents.map(d => ({ ...d, errorType: null, loading: true })))
    );
    dispatch(setGeneratePreviewSuccess());
    documents.forEach(({ id: documentId }) => {
      dispatch(getCorrespondenceDocumentAction(correspondenceId, documentId));
    });
  } catch (e) {
    dispatch(generatePreviewError());
  }
};

export const submitAPI = (correspondenceId, payload) => async dispatch => {
  try {
    dispatch(setSubmitLoading());
    const res = await submitCorrespondence(correspondenceId, payload);
    dispatch(setSubmittedSuccess(res));
  } catch (e) {
    dispatch(setSubmitError(e));
    throw new Error(e);
  }
};
