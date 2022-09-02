import { customerApi } from '../../api';

const { getTenancy: getTenancyDetails } = customerApi;

// Actions
export const GETTING_TENANCY = 'tenancy/GETTING_TENANCY';
export const PATCH_TENANT = 'tenancy/PATCH_TENANT';
export const SET_ERROR = 'tenancy/SET_ERROR';
export const SET_TENANCY = 'tenancy/SET_TENANCY';

const initialState = {
  error: false,
  loadingTenancy: false,
  tenants: [],
};

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case GETTING_TENANCY: {
      return {
        ...state,
        loadingTenancy: true,
      };
    }

    case PATCH_TENANT: {
      const tenants = state.tenants.map(tenant => {
        let newTenant = { ...tenant };
        if (payload.contactId === newTenant.contactId) {
          newTenant = {
            ...newTenant,
            ...payload,
          };
        }
        return newTenant;
      });

      return {
        ...state,
        tenants,
        loadingTenancy: false,
      };
    }

    case SET_ERROR: {
      return {
        ...state,
        error: true,
        loadingTenancy: false,
      };
    }

    case SET_TENANCY: {
      return {
        ...state,
        ...payload,
        loadingTenancy: false,
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const gettingTenancy = () => ({ type: GETTING_TENANCY });

export const setError = () => ({
  type: SET_ERROR,
});

export const setTenancy = payload => ({
  type: SET_TENANCY,
  payload,
});

export const patchTenant = payload => ({
  type: PATCH_TENANT,
  payload,
});

export const getTenancy = id => async dispatch => {
  dispatch(gettingTenancy());
  try {
    const { data } = await getTenancyDetails(id);
    dispatch(setTenancy(data));
  } catch (err) {
    dispatch(setError());
  }
};
