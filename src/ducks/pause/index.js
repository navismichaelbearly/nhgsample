import compose from 'ramda/src/compose';
import { arrearsApiV2 } from '../../api';

import mapStatusProperty from '../../util/mapPauseStatusProperty';
import extractPayloadObject from '../../util/extractPayload';
import pausePatchPayload from '../../util/pausePatchPayload';
import { SCHEDULEDSTATUSCODE, CANCELLEDSTATUSCODE } from '../../constants/pause';

const {
  createPause: createPauseApi,
  getPause: getPauseApi,
  getPauseRules: getPauseRulesApi,
  patchPause: patchPauseApi,
} = arrearsApiV2;

// Actions
export const CLEAR_PAUSE_ERROR = 'pause/CLEAR_PAUSE_ERROR';
export const PAUSES_LOADING = 'pause/PAUSES_LOADING';
export const PATCH_PAUSE_COMPLETE = 'pause/PATCH_PAUSE_COMPLETE';
export const SET_PAUSE = 'pause/SET_PAUSE';
export const SET_PAUSE_ERROR = 'pause/SET_PAUSE_ERROR';
export const SET_PAUSE_RULES = 'pause/SET_PAUSE_RULES';
export const INVALIDATE_ACTIVE_PAUSE = 'pause/INVALIDATE_ACTIVE_PAUSE';

export const initialState = { activePause: null, pauseRules: [], error: false, loading: true };

// utils
const digestPayload = compose(mapStatusProperty, extractPayloadObject);

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case CLEAR_PAUSE_ERROR: {
      return {
        ...state,
        error: false,
      };
    }
    case PAUSES_LOADING: {
      return {
        ...state,
        loading: true,
      };
    }
    case PATCH_PAUSE_COMPLETE: {
      return {
        ...state,
        activePause: null,
        loading: false,
      };
    }
    case SET_PAUSE: {
      return {
        ...state,
        error: false,
        loading: false,
        activePause: digestPayload(payload),
      };
    }
    case SET_PAUSE_ERROR: {
      return {
        ...state,
        error: true,
        loading: false,
      };
    }
    case SET_PAUSE_RULES: {
      return {
        ...state,
        error: false,
        loading: false,
        pauseRules: payload.pauseReasons,
      };
    }
    case INVALIDATE_ACTIVE_PAUSE: {
      return {
        ...state,
        activePause: null,
      };
    }
    default:
      return state;
  }
}

export const clearPauseError = () => ({
  type: CLEAR_PAUSE_ERROR,
});

export const pausesLoading = () => ({
  type: PAUSES_LOADING,
});

export const patchPauseComplete = () => ({
  type: PATCH_PAUSE_COMPLETE,
});

export const setPause = payload => ({
  type: SET_PAUSE,
  payload,
});

export const setPauseError = () => ({
  type: SET_PAUSE_ERROR,
});

export const setPauseRules = payload => ({
  type: SET_PAUSE_RULES,
  payload,
});

export const invalidateActivePause = () => ({ type: INVALIDATE_ACTIVE_PAUSE });

export const approvePause = (arrearsId, pauseId, description) => async dispatch => {
  dispatch(pausesLoading());
  try {
    if (description && description !== '') {
      await patchPauseApi(arrearsId, pauseId, pausePatchPayload(CANCELLEDSTATUSCODE, description));
    } else {
      await patchPauseApi(arrearsId, pauseId, pausePatchPayload(SCHEDULEDSTATUSCODE));
    }
    dispatch(patchPauseComplete());
  } catch (error) {
    dispatch(setPauseError());
    throw new Error(error);
  }
};

export const declinePause = (arrearsId, pauseId, payload) => async dispatch => {
  dispatch(pausesLoading());
  try {
    await patchPauseApi(arrearsId, pauseId, payload);
    dispatch(patchPauseComplete());
  } catch (error) {
    dispatch(setPauseError());
    throw new Error(error);
  }
};

export const cancelPause = (arrearsId, pauseId, payload = {}) => async dispatch => {
  dispatch(pausesLoading());
  try {
    await patchPauseApi(arrearsId, pauseId, payload);
    dispatch(patchPauseComplete());
  } catch (error) {
    dispatch(setPauseError());
    throw new Error(error);
  }
};

export const createPause = (arrearsId, payload) => async dispatch => {
  dispatch(pausesLoading());
  try {
    const { data } = await createPauseApi(arrearsId, payload);
    dispatch(setPause(data));
  } catch (error) {
    dispatch(setPauseError());
    throw new Error(error);
  }
};

export const getPause = (arrearsId, userId) => async dispatch => {
  dispatch(pausesLoading());
  const { data } = await getPauseApi(arrearsId, userId);
  dispatch(setPause(data));
};

export const getPauseRules = (arrearsId, userId) => async dispatch => {
  dispatch(pausesLoading());
  const { data } = await getPauseRulesApi(arrearsId, userId);
  dispatch(setPauseRules(data));
};

export const patchPause = (arrearsId, pauseId, payload) => async dispatch => {
  dispatch(pausesLoading());
  try {
    await patchPauseApi(arrearsId, pauseId, payload);
    dispatch(patchPauseComplete());
  } catch (error) {
    dispatch(setPauseError());
    throw new Error(error);
  }
};
