import { instantiateRibbon } from '../ribbon';
import { customerApi } from '../../api';
import { errorKey, showConfirmationKey } from '../../constants/statusKeys';

const { getCustomerAccounts, getCustomerDetails, updateContactDetails } = customerApi;

// Actions
export const LOADING = 'customer/LOADING';
export const PATCH_CUSTOMER_PROFILE = 'customer/UPDATE_CUSTOMER_PROFILE';
export const PATCH_CUSTOMER_PROFILE_ERROR = 'customer/PATCH_CUSTOMER_PROFILE_ERROR';
export const PATCH_CUSTOMER_PROFILE_RESET = 'customer/PATCH_CUSTOMER_PROFILE_RESET';
export const SET_CUSTOMER_ACCOUNTS = 'customer/SET_CUSTOMER_ACCOUNTS';
export const SET_CUSTOMER_PROFILE = 'customer/SET_CUSTOMER_PROFILE';
export const INVALIDATE_CUSTOMER_ACCOUNTS = 'customer/INVALIDATE_CUSTOMER_ACCOUNTS';

// Reducers
export default function reducer(state = {}, { type, payload }) {
  switch (type) {
    case PATCH_CUSTOMER_PROFILE: {
      return {
        ...state,
        profile: {
          ...state.profile,
          updateStatus: showConfirmationKey,
          loading: false,
        },
      };
    }

    case LOADING: {
      return {
        ...state,
        profile: {
          ...state.profile,
          loading: true,
        },
      };
    }

    case PATCH_CUSTOMER_PROFILE_ERROR: {
      return {
        ...state,
        profile: {
          ...state.profile,
          updateStatus: errorKey,
          loading: false,
        },
      };
    }

    case PATCH_CUSTOMER_PROFILE_RESET: {
      return {
        ...state,
        profile: {
          ...state.profile,
          updateStatus: null,
          loading: false,
        },
      };
    }

    case INVALIDATE_CUSTOMER_ACCOUNTS: {
      return {
        ...state,
        accounts: null,
      };
    }

    case SET_CUSTOMER_ACCOUNTS: {
      return {
        ...state,
        accounts: payload,
      };
    }

    case SET_CUSTOMER_PROFILE: {
      return {
        ...state,
        profile: payload,
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const loading = () => ({
  type: LOADING,
});

export const patchCustomerProfile = () => ({
  type: PATCH_CUSTOMER_PROFILE,
});

export const patchCustomerProfileError = () => ({
  type: PATCH_CUSTOMER_PROFILE_ERROR,
});

export const patchCustomerProfileReset = () => ({
  type: PATCH_CUSTOMER_PROFILE_RESET,
});

export const setCustomerAccounts = payload => ({
  type: SET_CUSTOMER_ACCOUNTS,
  payload,
});

export const invalidateCustomerAccounts = () => ({
  type: INVALIDATE_CUSTOMER_ACCOUNTS,
});

export const setCustomerProfile = payload => ({
  type: SET_CUSTOMER_PROFILE,
  payload,
});

export const getCustomerProfile = (id, expand = false) => async dispatch => {
  const { data } = await getCustomerDetails(id);
  const { data: accounts } = await getCustomerAccounts(data.partyIdentifier, expand);
  dispatch(setCustomerProfile(data));
  dispatch(setCustomerAccounts(accounts));
  dispatch(instantiateRibbon());
};

export const getAccountsTransactions = (
  partyId,
  dateRange,
  paymentReferenceNumber
) => async dispatch => {
  try {
    dispatch(invalidateCustomerAccounts());
    const { data: accounts } = await getCustomerAccounts(
      partyId,
      true,
      dateRange,
      paymentReferenceNumber
    );
    dispatch(setCustomerAccounts(accounts));
  } catch (err) {
    throw new Error(err);
  }
};

export const updateCustomerProfile = (id, payload) => async dispatch => {
  dispatch(loading());
  try {
    await updateContactDetails(id, payload);
    dispatch(patchCustomerProfile());
  } catch (e) {
    dispatch(patchCustomerProfileError());
  }
};
