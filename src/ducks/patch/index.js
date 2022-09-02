import { customerApi } from '../../api';

// Actions
export const SHOW_PATCH_SELECT = 'patch/SHOW_PATCH_SELECT';
export const HIDE_PATCH_SELECT = 'patch/HIDE_PATCH_SELECT';
export const SET_PATCH_LIST = 'patch/SET_PATCH_LIST';
export const SET_TEAM_MEMBERS = 'patch/SET_TEAM_MEMBERS';

const initialState = {
  visible: false,
  teamMembers: [],
  patchList: [],
};

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SHOW_PATCH_SELECT:
    case HIDE_PATCH_SELECT:
    case SET_PATCH_LIST:
    case SET_TEAM_MEMBERS: {
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
export const showPatchSelect = () => ({
  type: SHOW_PATCH_SELECT,
  payload: { visible: true },
});

export const hidePatchSelect = () => ({
  type: HIDE_PATCH_SELECT,
  payload: { visible: false },
});

export const setPatchList = patches => ({
  type: SET_PATCH_LIST,
  payload: {
    patchList: patches,
  },
});

export const setTeamMembers = teamMembers => ({
  type: SET_TEAM_MEMBERS,
  payload: { teamMembers },
});

export const getTeamMembers = teamId => async dispatch => {
  const { data } = await customerApi.getTeamMembersByTeamId(teamId);
  dispatch(setTeamMembers(data));
};
