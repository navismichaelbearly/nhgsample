import { arrearsApi } from '../../api';

const {
  createReferralCase: createReferralCaseAPI,
  getReferralTeams: getReferralTeamsAPI,
} = arrearsApi;

// Actions
export const REFERRAL_CASE_LOADING = 'arrears/REFERRAL_CASE_LOADING';
export const REFERRAL_CASE_ERROR = 'arrears/REFERRAL_CASE_ERROR';
export const REFERRAL_CASE_CREATED = 'arrears/REFERRAL_CASE_CREATED';
export const SET_REFERRAL_TEAMS = 'arrears/SET_REFERRAL_TEAMS';

export const initialState = {
  referralCaseCreated: false,
  referralTeams: [],
  loading: false,
  error: false,
};

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_REFERRAL_TEAMS: {
      const referralTeams = payload.referrableTeams;
      return {
        ...state,
        loading: false,
        error: false,
        referralTeams,
      };
    }
    case REFERRAL_CASE_CREATED: {
      return {
        ...state,
        loading: false,
        error: false,
        referralCaseCreated: true,
      };
    }
    case REFERRAL_CASE_LOADING: {
      return {
        ...state,
        loading: true,
        error: false,
        referralCaseCreated: false,
      };
    }
    case REFERRAL_CASE_ERROR: {
      return {
        ...state,
        loading: false,
        referralCaseCreated: false,
        error: true,
      };
    }
    default:
      return state;
  }
}

export const setReferralTeams = payload => ({
  type: SET_REFERRAL_TEAMS,
  payload,
});

export const createReferralCaseLoading = () => ({
  type: REFERRAL_CASE_LOADING,
});

export const createReferralCaseError = () => ({
  type: REFERRAL_CASE_ERROR,
});

export const setReferralCase = payload => ({
  type: REFERRAL_CASE_CREATED,
  payload,
});

export const getReferralTeams = () => async dispatch => {
  const { data } = await getReferralTeamsAPI('arrears');
  dispatch(setReferralTeams(data));
};

export const createReferralCase = (caseId, data) => async dispatch => {
  dispatch(createReferralCaseLoading());
  try {
    const res = await createReferralCaseAPI(caseId, data);
    dispatch(setReferralCase(res));
  } catch (error) {
    dispatch(createReferralCaseError());
    throw error.status;
  }
};
