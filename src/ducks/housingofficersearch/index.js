import { customerApi } from '../../api';

// Actions
export const CLEAR_SEARCH = 'housingofficersearch/CLEAR_SEARCH';
export const SEARCHING = 'housingofficersearch/SEARCHING';
export const RESULTS = 'housingofficersearch/RESULTS';
export const REQUEST_ERROR = 'housingofficersearch/REQUEST_ERROR';

const initialState = { loading: false, error: false, searchResults: [] };

// Reducers
export default function reducer(state = initialState, { type, searchResults }) {
  switch (type) {
    case CLEAR_SEARCH: {
      return {
        ...state,
        searchResults: [],
      };
    }
    case SEARCHING: {
      return {
        ...state,
        error: false,
        loading: true,
      };
    }

    case REQUEST_ERROR: {
      return {
        ...state,
        error: true,
        loading: false,
      };
    }

    case RESULTS: {
      return {
        ...state,
        error: false,
        loading: false,
        searchResults,
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const clearSearch = () => ({
  type: CLEAR_SEARCH,
});

export const searching = () => ({
  type: SEARCHING,
});

export const housingOfficersFound = housingOfficers => ({
  type: RESULTS,
  searchResults: (housingOfficers || []).map(ho => ({ id: ho.id, fullName: ho.fullname })),
});

export const requestError = () => ({
  type: REQUEST_ERROR,
});

export const search = searchTerm => async dispatch => {
  dispatch(searching());
  try {
    const { data: housingOfficers } = await customerApi.searchForHousingOfficers(searchTerm);
    dispatch(housingOfficersFound(housingOfficers));
  } catch (error) {
    dispatch(requestError());
    throw new Error(error);
  }
};
