import { arrearsApi } from '../../api';

const {
  approveLegalReferral: approveLegalReferralApi,
  cancelLegalReferral: cancelLegalReferralApi,
  getLegalReferral: getLegalReferralApi,
} = arrearsApi;

// Actions
export const SET_ERROR = 'legalReferral/SET_ERROR';
export const SET_LEGAL_REFERRAL = 'legalReferral/SET_LEGAL_REFERRAL';
export const SET_LEGAL_REFERRAL_STATE = 'legalReferral/SET_LEGAL_REFERRAL_STATE';
export const SET_LOADING = 'legalReferral/SET_LOADING';
export const CLEAR = 'legalReferral/CLEAR';

export const initialState = {
  error: false,
  loading: false,
};

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case CLEAR: {
      return {
        ...state,
        loading: true,
        error: false,
        errorStatus: undefined,
        detail: undefined,
      };
    }

    case SET_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
        errorStatus: payload,
      };
    }

    case SET_LOADING: {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }

    case SET_LEGAL_REFERRAL: {
      return {
        ...state,
        detail: payload,
        loading: false,
        error: false,
        errorStatus: undefined,
      };
    }

    case SET_LEGAL_REFERRAL_STATE: {
      return {
        ...state,
        state: payload,
        loading: false,
        error: false,
        errorStatus: undefined,
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const setError = payload => ({
  type: SET_ERROR,
  payload,
});

export const setLoading = () => ({ type: SET_LOADING });

export const clear = () => ({ type: CLEAR });

export const setLegalReferral = payload => ({
  type: SET_LEGAL_REFERRAL,
  payload,
});

export const setLegalReferralState = status => ({
  type: SET_LEGAL_REFERRAL_STATE,
  payload: status,
});

export const getLegalReferral = id => async dispatch => {
  dispatch(setLoading());
  try {
    const { data } = await getLegalReferralApi(id);
    dispatch(setLegalReferral(data));
  } catch (err) {
    const error = err.response || {};
    dispatch(setError(error.status));
  }
};

export const approveLegalReferral = (id, status) => async dispatch => {
  dispatch(setLoading());
  try {
    await approveLegalReferralApi(id);
    dispatch(setLegalReferralState(status));
  } catch (err) {
    const error = err.response || {};
    dispatch(setError(error.status));
  }
};

export const cancelLegalReferral = (id, payload) => async dispatch => {
  dispatch(setLoading());
  try {
    await cancelLegalReferralApi(id, payload);
    dispatch(setLegalReferralState('cancelled'));
  } catch (err) {
    const error = err.response || {};
    dispatch(setError(error.status));
  }
};

export const setLegalReferralSubmitted = id => async dispatch =>
  dispatch(approveLegalReferral(id, 'submitted'));

export const setLegalReferralApproved = id => async dispatch =>
  dispatch(approveLegalReferral(id, 'approved'));
