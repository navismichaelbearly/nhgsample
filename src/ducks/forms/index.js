import formSdk from '../../util/formSdk';

const { createNewSubmissionByName, enableForCustomer, api } = formSdk;

const getLatestSubmission = subs =>
  subs.reduce((prev, next) => (prev.lastUpdated > next.lastUpdated ? prev : next));

// Actions
export const CLEAR_SUBMISSIONS = 'forms/CLEAR_SUBMISSIONS';
export const FORM_SUBMITTED = 'forms/FORM_SUBMITTED';
export const SET_ERROR = 'forms/SET_ERROR';
export const SET_FORM_RENDERED = 'forms/SET_FORM_RENDERED';
export const SET_LOADING = 'forms/SET_LOADING';
export const SET_SUBMISSION = 'forms/SET_SUBMISSION';

export const initialState = {
  error: false,
  loading: false,
};

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case FORM_SUBMITTED: {
      return {
        ...state,
        formSubmitted: true,
      };
    }

    case SET_ERROR: {
      return {
        ...state,
        error: true,
        loading: false,
      };
    }

    case SET_FORM_RENDERED: {
      return {
        ...state,
        formRendered: true,
      };
    }

    case SET_LOADING: {
      return {
        ...state,
        error: false,
        loading: true,
      };
    }

    case SET_SUBMISSION: {
      const formState = state[payload.formName] || {};
      const existingSubmisions = formState.submissions || [];
      return {
        ...state,
        error: false,
        formSubmitted: false,
        loading: false,
        [payload.formName]: {
          ...formState,
          submissions: [...existingSubmisions, payload.submissionId],
        },
      };
    }

    case CLEAR_SUBMISSIONS: {
      const formState = state[payload.formName] || {};
      return {
        ...state,
        error: false,
        formRendered: false,
        loading: false,
        [payload.formName]: {
          ...formState,
          submissions: [],
        },
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const formSubmitted = () => ({
  type: FORM_SUBMITTED,
});

export const setError = () => ({
  type: SET_ERROR,
});

export const setFormRendered = () => ({
  type: SET_FORM_RENDERED,
});

export const setLoading = () => ({
  type: SET_LOADING,
});

export const clearSubmissions = formName => ({
  type: CLEAR_SUBMISSIONS,
  payload: {
    formName,
  },
});

export const setSubmission = (formName, submissionId) => ({
  type: SET_SUBMISSION,
  payload: {
    formName,
    submissionId,
  },
});

export const generateNewSubmissionId = (formName, caseId) => async dispatch => {
  try {
    enableForCustomer(caseId);
    const newSubmissionId = await createNewSubmissionByName(formName);
    dispatch(setSubmission(formName, newSubmissionId));
  } catch (err) {
    dispatch(setError);
  }
};

export const createSubmission = (formName, caseId) => async dispatch => {
  dispatch(setLoading());
  try {
    enableForCustomer(caseId);
    let submissionId;
    const inProgressSubmissionsResponse = await api.submissions.getInProgressSubmissionsByFormName(
      formName,
      caseId
    );
    const { data: inProgressSubmissions } = inProgressSubmissionsResponse;
    if (inProgressSubmissions && inProgressSubmissions.length) {
      submissionId = getLatestSubmission(inProgressSubmissions).submissionId;
    } else {
      submissionId = await createNewSubmissionByName(formName);
    }
    dispatch(setSubmission(formName, submissionId));
  } catch (err) {
    dispatch(setError());
  }
};
