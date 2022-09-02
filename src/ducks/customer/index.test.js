import { errorKey, showConfirmationKey } from '../../constants/statusKeys';

import reducer, {
  getCustomerProfile,
  patchCustomerProfile,
  patchCustomerProfileError,
  patchCustomerProfileReset,
  setCustomerAccounts,
  setCustomerProfile,
  SET_CUSTOMER_ACCOUNTS,
  SET_CUSTOMER_PROFILE,
} from './';

jest.mock('nhh-styles', () => ({
  getWindowOrigin: () => 'WindowOrigin',
}));

jest.mock('../../api', () => ({
  customerApi: {
    getCustomerDetails: id => ({
      data: { partyIdentifier: id },
    }),
    getCustomerAccounts: id => ({
      data: [`${id}-account`],
    }),
    updateContactDetails: id => ({
      data: { foo: id },
    }),
  },
}));

const state = {
  foo: 'bar',
};

describe('customer reducer', () => {
  const sdk = window.sdk;
  const env = process.env.NODE_ENV;
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  afterEach(() => {
    window.sdk = sdk;
    process.env.NODE_ENV = env;
    jest.clearAllMocks();
  });

  it('should set the customer state after getting the profile from api', async () => {
    await getCustomerProfile('abc')(dispatch);
    expect(dispatch).toBeCalledWith({
      payload: { partyIdentifier: 'abc' },
      type: SET_CUSTOMER_PROFILE,
    });
    expect(dispatch).toBeCalledWith({ payload: ['abc-account'], type: SET_CUSTOMER_ACCOUNTS });
  });

  it('generates the correct state for a setCustomerAccounts action', () => {
    const result = reducer(state, setCustomerAccounts(['account1', 'account2']));
    expect(result).toEqual({
      foo: 'bar',
      accounts: ['account1', 'account2'],
    });
  });

  it('generates the correct state for a setCustomerProfile action', () => {
    const result = reducer(
      state,
      setCustomerProfile({
        bar: 'baz',
      })
    );
    expect(result).toEqual({
      foo: 'bar',
      profile: {
        bar: 'baz',
      },
    });
  });

  it('generates the correct state for a patchCustomerProfile action', () => {
    const result = reducer(
      {
        ...state,
        profile: { foo: 'bar', loading: false },
      },
      patchCustomerProfile()
    );
    expect(result).toEqual({
      foo: 'bar',
      profile: { foo: 'bar', loading: false, updateStatus: showConfirmationKey },
    });
  });

  it('generates the correct state for a patchCustomerProfileError action', () => {
    const result = reducer(
      {
        ...state,
        profile: { foo: 'bar', loading: false },
      },
      patchCustomerProfileError()
    );
    expect(result).toEqual({
      foo: 'bar',
      profile: { foo: 'bar', loading: false, updateStatus: errorKey },
    });
  });

  it('generates the correct state for a patchCustomerProfileReset action', () => {
    const result = reducer(
      {
        ...state,
        profile: { foo: 'bar' },
      },
      patchCustomerProfileReset()
    );
    expect(result).toEqual({
      foo: 'bar',
      profile: { foo: 'bar', loading: false, updateStatus: null },
    });
  });
});
