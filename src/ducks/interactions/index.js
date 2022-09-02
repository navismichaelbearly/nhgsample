import { interactionsApi, correspondenceApi } from '../../api';

const {
  getActivityTypes: getActivityTypesAPI,
  createInteraction: createInteractionAPI,
} = interactionsApi;

const { getThirdPartyRecipients } = correspondenceApi;

// Actions
export const CLEAR_INTERACTION_ERROR = 'interaction/CLEAR_INTERACTION_ERROR';
export const SET_ACTIVITY_TYPES = 'interaction/SET_ACTIVITY_TYPES';
export const SET_INTERACTION = 'interactions/SET_INTERACTION';
export const SET_INTERACTION_ERROR = 'interaction/SET_INTERACTION_ERROR';
export const SET_INTERACTION_LOAD = 'interaction/SET_INTERACTION_LOAD';
export const SET_THIRD_PARTY = 'interaction/SET_THIRD_PARTY';
export const SET_THIRD_PARTY_ERROR = 'interaction/SET_THIRD_PARTY_ERROR';

export const initialState = {
  activity: {},
  error: false,
  loading: false,
  activityTypes: [],
  thirdParties: undefined,
  thirdPartiesError: false,
};

const splitActivityTypes = types =>
  types.map(t => ({
    ...t,
    name: t.name.split(/(?=[A-Z])/).join(' '),
  }));

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case CLEAR_INTERACTION_ERROR: {
      return {
        ...state,
        error: false,
      };
    }
    case SET_ACTIVITY_TYPES: {
      return {
        ...state,
        activityTypes: splitActivityTypes(payload),
      };
    }
    case SET_INTERACTION: {
      return {
        ...state,
        error: false,
        loading: false,
        payload,
      };
    }
    case SET_INTERACTION_ERROR: {
      return {
        ...state,
        error: true,
        loading: false,
      };
    }
    case SET_INTERACTION_LOAD: {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }
    case SET_THIRD_PARTY: {
      return {
        ...state,
        thirdParties: { ...payload, id: payload.contactId, name: 'thirdParty' },
      };
    }
    case SET_THIRD_PARTY_ERROR: {
      return {
        ...state,
        thirdPartiesError: true,
      };
    }
    default:
      return state;
  }
}

export const clearInteractionError = () => ({
  type: CLEAR_INTERACTION_ERROR,
});

export const interactionError = () => ({
  type: SET_INTERACTION_ERROR,
});

export const interactionLoading = () => ({
  type: SET_INTERACTION_LOAD,
});

export const setActivityTypes = payload => ({
  type: SET_ACTIVITY_TYPES,
  payload,
});

export const setInteraction = payload => ({
  type: SET_INTERACTION,
  payload,
});

export const setThirdParties = payload => ({
  type: SET_THIRD_PARTY,
  payload,
});

export const setThirdPartiesError = () => ({
  type: SET_THIRD_PARTY_ERROR,
});

export const createInteraction = (arrearsId, payload) => async dispatch => {
  dispatch(interactionLoading());
  try {
    const resp = await createInteractionAPI(arrearsId, payload);
    dispatch(setInteraction(resp));
  } catch (error) {
    dispatch(interactionError());
    throw new Error(error);
  }
};

export const getActivityTypes = () => async dispatch => {
  try {
    const resp = await getActivityTypesAPI();
    dispatch(setActivityTypes(resp.data));
  } catch (error) {
    dispatch(interactionError());
  }
};

export const getThirdPartiesContact = opts => async dispatch => {
  try {
    const resp = await getThirdPartyRecipients(opts);
    dispatch(setThirdParties(resp.data));
  } catch (error) {
    dispatch(setThirdPartiesError());
  }
};
