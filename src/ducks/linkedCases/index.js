import { linkedCasesApi } from '../../api';

export const SET_LINKEDCASES_LOADING = 'linkedCases/LINKEDCASES_LOADING';
export const SET_LINKEDCASES_LOADED_SUCCESS = 'linkedCases/LINKEDCASES_LOADED_SUCCESS';
export const SET_LINKEDCASES_LOADED_ERROR = 'linkedCases/LINKEDCASES_LOADED_ERROR';
export const SET_LINKEDCASES = 'linkedCases/SET_LINKEDCASES';

export const initialState = {
  linkedCasesLoading: false,
  linkedCasesLoadingError: false,
  linkedCases: [],
};

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_LINKEDCASES_LOADING:
      return {
        ...state,
        linkedCasesLoading: true,
        linkedCasesLoadingError: false,
      };
    case SET_LINKEDCASES_LOADED_SUCCESS:
      return {
        ...state,
        linkedCasesLoading: false,
        linkedCasesLoadingError: false,
      };
    case SET_LINKEDCASES_LOADED_ERROR:
      return {
        ...state,
        linkedCasesLoading: false,
        linkedCasesLoadingError: true,
      };
    case SET_LINKEDCASES:
      return {
        ...state,
        linkedCases: payload || initialState.linkedCases,
      };
    default:
      return state;
  }
}

export const loadLinkedCases = caseId => async dispatch => {
  dispatch({ type: SET_LINKEDCASES_LOADING });
  try {
    const { data } = await linkedCasesApi.getLinkedCasesById(caseId);
    dispatch({ type: SET_LINKEDCASES, payload: data });
  } catch (err) {
    dispatch({ type: SET_LINKEDCASES });
  }
};
