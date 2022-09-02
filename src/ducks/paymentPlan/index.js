import { arrearsApiV2 } from '../../api';

const {
  createPaymentPlan: createPaymentPlanAPI,
  viewPaymentPlan: viewPaymentPlanAPI,
  cancelPaymentPlan: cancelPaymentPlanAPI,
} = arrearsApiV2;

// Actions
export const CLEAR_PLAN_ERROR = 'paymentPlan/CLEAR_PLAN_ERROR';
export const SET_PLAN = 'paymentPlan/SET_PLAN';
export const SET_PLAN_ERROR = 'paymentPlan/SET_PLAN_ERROR';
export const SET_PLAN_LOAD = 'paymentPlan/SET_PLAN_LOAD';
export const initialState = {
  error: false,
  loading: false,
  plan: {},
};

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case CLEAR_PLAN_ERROR: {
      return {
        ...state,
        error: false,
      };
    }
    case SET_PLAN: {
      return {
        ...state,
        error: false,
        loading: false,
        plan: payload,
      };
    }
    case SET_PLAN_ERROR: {
      return {
        ...state,
        error: true,
        loading: false,
      };
    }
    case SET_PLAN_LOAD: {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }
    default:
      return state;
  }
}

export const clearPlanError = () => ({
  type: CLEAR_PLAN_ERROR,
});

export const setPlan = payload => ({
  type: SET_PLAN,
  payload,
});

export const planError = () => ({
  type: SET_PLAN_ERROR,
});

export const planLoading = () => ({
  type: SET_PLAN_LOAD,
});

export const closePlan = (arrearsId, paymentPlanId, payload) => async dispatch => {
  dispatch(planLoading());
  try {
    const resp = await cancelPaymentPlanAPI(arrearsId, paymentPlanId, payload);
    dispatch(setPlan(resp));
  } catch (error) {
    dispatch(planError());
    throw new Error(error);
  }
};

export const createPlan = (arrearsId, payload) => async dispatch => {
  dispatch(planLoading());
  try {
    const resp = await createPaymentPlanAPI(arrearsId, payload);
    dispatch(setPlan(resp));
    return resp.data.id;
  } catch (error) {
    dispatch(planError());
    throw new Error(error);
  }
};

export const getPlan = (arrearsId, paymentPlanId) => async dispatch => {
  dispatch(planLoading());
  try {
    const resp = await viewPaymentPlanAPI(arrearsId, paymentPlanId);
    dispatch(setPlan(resp.data));
  } catch (error) {
    dispatch(planError());
    throw new Error(error);
  }
};
