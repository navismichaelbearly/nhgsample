import compose from 'ramda/src/compose';
import isEmpty from 'ramda/src/isEmpty';
import path from 'ramda/src/path';
import { sortBy } from 'lodash';
import { activitiesApi, interactionsApi, arrearsApi, paymentsApi, arrearsApiV2 } from '../../api';
import mapPauseStatusProperty from '../../util/mapPauseStatusProperty';
import extractPayloadObject from '../../util/extractPayload';
import { mapPaymentPlanActivityType as mapPaymentPlanActivityTypeFromOwnApi } from '../../util/paymentPlan';
import { activityHistoryTypes } from '../../constants/activityHistoryTypes';
import { GENERIC_PAYMENTPLAN, ACTIVITY_PAYMENTPLAN } from '../../constants/paymentPlan';
import { GENERIC_LEGAL_REFERRAL, ACTIVITY_LEGAL_REFERRAL } from '../../constants/legalReferral';
import getAttachmentsFromId from '../../util/getAttachmentsList';

const { getCaseHistoryWithQueryParams } = activitiesApi;

// utils
const digestPausePayload = compose(mapPauseStatusProperty, extractPayloadObject);

const digestPaymentPlanPayload = compose(
  mapPaymentPlanActivityTypeFromOwnApi,
  extractPayloadObject
);

const mapPropertiesFromActivityType = (type, data) => {
  switch (type) {
    case activityHistoryTypes.PAUSE: {
      return digestPausePayload(data);
    }
    case activityHistoryTypes.PAYMENT_PLAN: {
      return digestPaymentPlanPayload(data);
    }
    default: {
      return extractPayloadObject(data);
    }
  }
};

const mapActivityTypeFromHistory = item => {
  switch (item.type) {
    case ACTIVITY_PAYMENTPLAN: {
      return { ...item, originalType: item.type, type: GENERIC_PAYMENTPLAN };
    }
    case GENERIC_LEGAL_REFERRAL:
    case ACTIVITY_LEGAL_REFERRAL: {
      return { ...item, originalType: ACTIVITY_LEGAL_REFERRAL, type: GENERIC_LEGAL_REFERRAL };
    }
    default: {
      return item;
    }
  }
};

// Actions
export const SET_ERROR = 'activities/SET_ERROR';
export const SET_ACTIVITY_DETAIL = 'activities/SET_ACTIVITY_DETAIL';
export const SET_ACTIVITY_HISTORY = 'activities/SET_ACTIVITY_HISTORY';
export const SET_LOADING = 'activities/SET_LOADING';
export const INVALIDATE_ACTIVITY_DETAIL = 'activities/INVALIDATE_ACTIVITY_DETAIL';
export const SET_ATTACHMENTS_LOADING = 'activities/SET_ATTACHMENTS_LOADING';
export const SET_ATTACHMENTS = 'activities/SET_ATTACHMENTS';
export const SET_ATTACHMENTS_ERROR = 'activities/SET_ATTACHMENTS_ERROR';

export const initialState = {
  error: false,
  loading: false,
  attachments: [],
  attachmentsLoading: false,
  attachmentsError: false,
};

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_ERROR: {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }

    case SET_ATTACHMENTS_ERROR: {
      return {
        ...state,
        attachmentsLoading: false,
        attachmentsError: true,
      };
    }

    case SET_LOADING: {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }

    case SET_ATTACHMENTS_LOADING: {
      return {
        ...state,
        attachmentsLoading: true,
        attachmentsError: false,
      };
    }

    case SET_ATTACHMENTS: {
      return {
        ...state,
        attachmentsLoading: false,
        attachmentsError: false,
        attachments: payload,
      };
    }

    case SET_ACTIVITY_DETAIL: {
      return {
        ...state,
        detail: mapActivityTypeFromHistory(payload),
        loading: false,
        error: false,
      };
    }

    case INVALIDATE_ACTIVITY_DETAIL: {
      return {
        ...state,
        detail: null,
      };
    }

    case SET_ACTIVITY_HISTORY: {
      const activityPayloadSortByDesc = sortBy(payload, o => new Date(o.createdAt)).reverse();
      return {
        ...state,
        history: activityPayloadSortByDesc.map(mapActivityTypeFromHistory),
        loading: false,
        error: false,
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const setError = () => ({
  type: SET_ERROR,
});
export const setAttachmentsError = () => ({ type: SET_ATTACHMENTS_ERROR });

export const setLoading = () => ({ type: SET_LOADING });
export const setAttachmentsLoading = () => ({ type: SET_ATTACHMENTS_LOADING });

export const invalidateActivityDetail = () => ({ type: INVALIDATE_ACTIVITY_DETAIL });

export const setActivityHistory = payload => ({
  type: SET_ACTIVITY_HISTORY,
  payload,
});

export const setActivityDetail = payload => ({
  type: SET_ACTIVITY_DETAIL,
  payload,
});

export const setAttachments = payload => ({
  type: SET_ATTACHMENTS,
  payload,
});

export const getActivityHistory = id => async dispatch => {
  dispatch(setLoading());
  try {
    const { data } = await getCaseHistoryWithQueryParams(id, { notificationSent: true });
    dispatch(setActivityHistory(data));
  } catch (err) {
    dispatch(setError());
    throw err;
  }
};

export const invalidateActivityHistory = () => dispatch => {
  dispatch(setActivityHistory([]));
};

export const getActivity = ({ link, type, id }) => async (dispatch, getState) => {
  dispatch(setLoading());
  const activityDetailIsSet = !isEmpty(path(['activities', 'detail'], getState()));
  if (activityDetailIsSet) {
    dispatch(invalidateActivityDetail());
  }

  try {
    let responseData;
    switch (link.service) {
      case 'arrears/web':
        switch (type) {
          case activityHistoryTypes.PAUSE: {
            const { data } = await arrearsApiV2.getDataFromUrl(link.path);
            const dataObj = mapPropertiesFromActivityType(type, data);
            responseData = { type, ...dataObj };
            break;
          }
          default: {
            const { data } = await arrearsApi.getDataFromUrl(link.path);
            const dataObj = mapPropertiesFromActivityType(type, data);
            responseData = { type, ...dataObj };
          }
        }
        break;
      case 'payments/web':
        {
          const { data } = await paymentsApi.getDataFromUrl(link.path);
          responseData = { type: activityHistoryTypes.PAYMENT, ...data };
        }
        break;
      case 'interactions/web':
      default: {
        const { data } = await interactionsApi.getDataFromUrl(link.path);
        const dataObj = extractPayloadObject(data);
        responseData = { type: activityHistoryTypes.INTERACTION, ...dataObj };
      }
    }
    dispatch(setActivityDetail(responseData));
    dispatch(setAttachmentsLoading());
    try {
      const response = await getAttachmentsFromId(responseData.type, id);
      dispatch(setAttachments(response.data));
    } catch (error) {
      dispatch(setAttachmentsError());
    }
  } catch (err) {
    dispatch(setError());
    throw err;
  }
};
