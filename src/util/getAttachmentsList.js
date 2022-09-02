import { documentsApi } from '../api';
import { activityHistoryTypes } from '../constants/activityHistoryTypes';

const apiByType = type => {
  switch (type) {
    case activityHistoryTypes.INTERACTION:
    case activityHistoryTypes.PAYMENT_PLAN: {
      return documentsApi.getActivityDocuments;
    }
    case activityHistoryTypes.LEGAL_REFERRAL: {
      return documentsApi.getCaseDocuments;
    }
    default:
      return () => ({ data: [] });
  }
};

export default async (type, id) => {
  const res = await apiByType(type)(id);
  return res;
};
