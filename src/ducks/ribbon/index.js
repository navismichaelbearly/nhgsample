import { customerDashboard, employeeDashboard } from '../../constants/routes';
import getHelpers from '../../util/stateHelpers';

// Actions
const UPDATE_RIBBON = 'ribbon/UPDATE_RIBBON';

export const initialState = {
  breadcrumb: [],
  title: '',
  show: false,
};

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case UPDATE_RIBBON: {
      if (typeof payload.value === 'undefined') {
        return {
          ...state,
          ...payload,
        };
      }

      const { prop, value } = payload;
      return {
        ...state,
        [prop]: value,
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const updateRibbon = (prop, value) => ({
  type: UPDATE_RIBBON,
  payload: value ? { prop, value } : prop,
});

export const instantiateRibbon = () => (dispatch, getState) => {
  const { getString, isHousingOfficer } = getHelpers(getState());
  dispatch(
    updateRibbon({
      dashboardButtonText: getString(['dashboard']),
      dashboardUrl: isHousingOfficer ? employeeDashboard : customerDashboard,
      show: true,
    })
  );
};
