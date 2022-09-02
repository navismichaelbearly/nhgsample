import { setPatchList, getTeamMembers } from '../patch';
import getUserType from '../../util/getUserType';
import { getRoles } from '../../util/userRoles';
import { getPatchInfo } from '../../util/patch';
import { instantiateRibbon } from '../ribbon';
import { customerApi } from '../../api';

const { getHousingOfficer } = customerApi;

// Actions
const DISPLAY_LOGIN = 'user/DISPLAY_LOGIN';
const INITIALISED = 'user/INITIALISED';
const LOGIN = 'user/LOGIN';
const LOGOUT = 'user/LOGOUT';
export const SET_PROFILE = 'user/SET_PROFILE';
const START_WAITING = 'user/START_WAITING';
const STOP_WAITING = 'user/STOP_WAITING';

const initialState = {
  initialised: false,
  waiting: false,
  loggedIn: false,
  profile: {},
  idTokenPayload: {},
  userType: '',
  userEmail: '',
  roles: [],
};

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case INITIALISED:
      return {
        ...state,
        initialised: true,
      };

    case LOGIN:
      return {
        ...state,
        loggedIn: true,
        id: payload,
        userType: getUserType(payload),
        roles: getRoles(payload),
      };

    case LOGOUT:
      return {
        ...state,
        loggedIn: false,
        profile: null,
      };

    case SET_PROFILE:
      return {
        ...state,
        loggedIn: true,
        profile: payload,
      };

    case START_WAITING:
      return {
        ...state,
        waiting: true,
      };

    case STOP_WAITING:
      return {
        ...state,
        waiting: false,
      };

    default:
      return state;
  }
}

// Dispatches

export const loginSuccess = payload => ({
  type: LOGIN,
  payload,
});

export const setProfile = payload => ({
  type: SET_PROFILE,
  payload,
});

export const startWaiting = () => ({
  type: START_WAITING,
});

export const stopWaiting = () => ({
  type: STOP_WAITING,
});

export const initialised = () => ({
  type: INITIALISED,
});

export const displayLogin = () => {
  if (window.sdk) window.sdk.login();
  return { type: DISPLAY_LOGIN };
};

export const getHoProfile = email => async (dispatch, getState) => {
  const { data } = await getHousingOfficer(email);
  const patchState = getState().patch;
  data.isHousingOfficer = true;
  if (data.patchName && patchState.patchList.length === 0) {
    dispatch(setPatchList([getPatchInfo(data)]));
  }
  dispatch(setProfile(data));
  dispatch(instantiateRibbon());
  dispatch(getTeamMembers(data.team.id));
};

export const logout = url => {
  if (window.sdk) {
    window.sdk.authService.logout(url);
  }
  sessionStorage.removeItem('loggedIn');
  return { type: LOGOUT };
};
