/* eslint-disable prettier/prettier */
import { customerApi } from '../../api';

// Actions
export const GETTING_WELFARE_REFORM = 'welfare/GETTING_WELFARE_REFORM';
export const SET_WELFARE_REFORM = 'welfare/SET_WELFARE_REFORM';
export const SET_WELFARE_ERROR = 'welfare/SET_WELFARE_ERROR';
export const PATCH_WELARE_COMPLETE = 'welfare/PATCH_WELARE_COMPLETE';
export const SET_APA_STATUS = 'welfare/SET_APA_STATUS';
export const SET_UC_STATUS = 'welfare/SET_UC_STATUS';

const initialState = {
  visible: false,
  welfareReform: {},
  apaStatus: {},
  ucStatus: {},
};

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case PATCH_WELARE_COMPLETE: {
      return {
        ...state,
        ...payload,
      };
    }
    case GETTING_WELFARE_REFORM: {
      return {
        ...state,
        loading: true,
      };
    }
    case SET_WELFARE_ERROR: {
      return {
        ...state,
        error: true,
      };
    }
    case SET_WELFARE_REFORM: {
      return {
        ...state,
        ...payload,
      };
    }
    case SET_APA_STATUS: {
      return {
        ...state,
        ...payload,
      };
    }
    case SET_UC_STATUS: {
      return {
        ...state,
        ...payload,
      };
    }
    default:
      return state;
  }
}

// Dispatches
export const loading = () => ({ type: GETTING_WELFARE_REFORM });

export const setWelfareReformError = () => ({
  type: SET_WELFARE_ERROR,
});

export const patchWelfareReformComplete = payload => ({
  type: PATCH_WELARE_COMPLETE,
  payload,
});

export const patchWelfareReform = (tenancyId, params) => async dispatch => {
  try {
    dispatch(loading());
    await customerApi.updateWelfareReformDetails(tenancyId, params);
    dispatch(patchWelfareReformComplete(params));
  } catch (error) {
    dispatch(setWelfareReformError());
    throw new Error(error);
  }
};

export const setWelfareReform = welfareReform => ({
  type: SET_WELFARE_REFORM,
  payload: { welfareReform },
});

export const getWelfareReform = tenancyId => async dispatch => {
  const { data } = await customerApi.getWelfareReformDetails(tenancyId);
  dispatch(setWelfareReform(data));
};

export const setAPAStatus = apaStatus => ({
  type: SET_APA_STATUS,
  payload: { apaStatus },
});

export const getAPAStatus = () => async dispatch => {
  const optionSet = await customerApi.optionSet(
    'welfareReform/alternativePaymentArrangementStatus'
  );
  dispatch(setAPAStatus(optionSet.data.options));
};

export const setUCStatus = ucStatus => ({
  type: SET_UC_STATUS,
  payload: { ucStatus },
});

export const getUCStatus = () => async dispatch => {
  const optionSet = await customerApi.optionSet(
    'welfareReform/ucArrearsPaymentStatus'
  );
  dispatch(setUCStatus(optionSet.data.options));
};
