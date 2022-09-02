import path from 'ramda/src/path';
import { arrearsApiV2 } from '../../api';
import mapPauseStatusProperty from '../../util/mapPauseStatusProperty';
import objectWithoutNullProperties from '../../util/objectWithoutNullProperties';

const {
  getArrearsDetail: getDetail,
  getStatuses: getArrearsStatuses,
  getArrearsSummary: getArrearsSummaryApi,
  serveNOSP: serveNOSPApi,
  getArrearsStats: getArrearsStatsApi,
} = arrearsApiV2;

// Actions
export const CLEAR_NOSP_ERROR = 'arrears/CLEAR_NOSP_ERROR';
export const GETTING_ARREARS = 'arrears/GETTING_ARREARS';
export const GETTING_ARREARS_STATS = 'arrears/GETTING_ARREARS_STATS';
export const SET_ARREARS = 'arrears/SET_ARREARS';
export const SET_ARREARS_ERROR = 'arrears/SET_ARREARS_ERROR';
export const SERVE_NOSP = 'arrears/SERVE_NOSP';
export const SERVE_NOSP_LOADING = 'arrears/SERVE_NOSP_LOADING';
export const SERVE_NOSP_ERROR = 'arrears/SERVE_NOSP_ERROR';
export const SET_ARREARS_DETAIL = 'arrears/SET_ARREARS_DETAIL';
export const SET_ARREARS_STATS = 'arrears/SET_ARREARS_STATS';
export const SET_FILTERS = 'arrears/SET_FILTERS';
export const SET_STATUSES = 'arrears/SET_STATUSES';

export const initialState = {
  error: false,
  filters: {},
  items: [],
  loadingArrears: false,
  loadingArrearsStats: false,
  nospServeError: false,
  nospLoading: false,
  resultsCount: null,
  stats: null,
  statuses: {},
};

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case CLEAR_NOSP_ERROR: {
      return {
        ...state,
        nospServeError: false,
      };
    }
    case GETTING_ARREARS: {
      return {
        ...state,
        loadingArrears: true,
      };
    }

    case SET_STATUSES: {
      const statusesObject = Object.keys(payload).length
        ? payload.reduce((acc, curr) => {
            acc[curr.name] = acc[curr.name] || {};
            acc[curr.name] = {
              count: curr.count,
              id: curr.id,
              products: curr.products,
            };
            return acc;
          }, {})
        : {};
      return {
        ...state,
        statuses: statusesObject,
      };
    }

    case GETTING_ARREARS_STATS: {
      return {
        ...state,
        loadingArrearsStats: true,
      };
    }

    case SERVE_NOSP_ERROR: {
      return {
        ...state,
        nospLoading: false,
        nospServeError: true,
      };
    }

    case SERVE_NOSP_LOADING: {
      return {
        ...state,
        nospLoading: true,
      };
    }

    case SERVE_NOSP: {
      return {
        ...state,
        nospLoading: false,
      };
    }

    case SET_ARREARS: {
      let items;
      if (payload.page) {
        items = [...state.items, ...payload.data];
      } else {
        items = payload.data;
      }
      return {
        ...state,
        items,
        loadingArrears: false,
      };
    }

    case SET_ARREARS_STATS: {
      return {
        ...state,
        loadingArrearsStats: false,
        stats: payload,
      };
    }

    case SET_ARREARS_DETAIL: {
      const items = [...state.items];
      const itemIndex = items.findIndex(i => i.id === payload.id);
      const item = items[itemIndex];
      const updatedItem = { ...item, ...payload.detail, id: payload.id, allDetails: true };
      if (updatedItem.pauseSummary) {
        updatedItem.pauseSummary = updatedItem.pauseSummary.map(mapPauseStatusProperty);
      }

      if (item) {
        items[itemIndex] = updatedItem;
      } else {
        items.push(updatedItem);
      }

      return {
        ...state,
        items,
        loadingArrears: false,
      };
    }

    case SET_FILTERS: {
      return {
        ...state,
        filterLabel: path(['item', 'label'], payload),
        filters: payload.opts,
        resultsCount: path(['item', 'count'], payload),
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const gettingArrears = () => ({ type: GETTING_ARREARS });

export const getArrearsStats = () => ({ type: GETTING_ARREARS_STATS });

export const setArrears = payload => ({
  type: SET_ARREARS,
  payload,
});

export const setStatuses = payload => ({
  type: SET_STATUSES,
  payload,
});

export const setArrearsDetail = payload => ({
  type: SET_ARREARS_DETAIL,
  payload,
});

export const setArrearsStats = payload => ({
  type: SET_ARREARS_STATS,
  payload,
});

export const serveNOSPError = () => ({
  type: SERVE_NOSP_ERROR,
});
export const serveNOSPSuccess = () => ({
  type: SERVE_NOSP,
});
export const serveNOSPLoading = () => ({
  type: SERVE_NOSP_LOADING,
});

export const clearNOSPError = () => ({
  type: CLEAR_NOSP_ERROR,
});

export const setFilters = payload => ({
  type: SET_FILTERS,
  payload,
});

export const getArrearsSummary = opts => async (dispatch, getState) => {
  const state = getState();
  dispatch(gettingArrears());
  const { data } = await getArrearsSummaryApi({
    ...objectWithoutNullProperties(opts),
    sort: opts.sort || 'priority',
    count: 6,
    pageNumber: opts.pageNumber || 1,
    ...objectWithoutNullProperties(state.arrears.filters),
  });
  dispatch(setArrears({ data, page: opts.pageNumber }));
};

export const getArrearsDetail = id => async dispatch => {
  dispatch(gettingArrears());
  const { data: detail } = await getDetail(id);
  dispatch(setArrearsDetail({ id, detail }));
};

export const getArrearsStatistics = patch => async dispatch => {
  dispatch(getArrearsStats());
  const { data: stats } = await getArrearsStatsApi(patch);
  dispatch(setArrearsStats(stats));
};

export const getStatuses = opts => async dispatch => {
  try {
    const { data } = await getArrearsStatuses({ ...objectWithoutNullProperties(opts) });
    dispatch(setStatuses(data));
  } catch (e) {
    dispatch(setStatuses({}));
  }
};

export const serveNOSP = arrearsId => async dispatch => {
  dispatch(serveNOSPLoading());
  try {
    const res = await serveNOSPApi(arrearsId);
    dispatch(serveNOSPSuccess(res));
  } catch (e) {
    dispatch(serveNOSPError());
    throw new Error(e);
  }
};

export const updateFiltersAndFetchResults = (opts, item) => async dispatch => {
  await dispatch(setFilters({ opts, item }));
  try {
    dispatch(getArrearsSummary({}));
  } catch (e) {
    throw new Error(e);
  }
};
