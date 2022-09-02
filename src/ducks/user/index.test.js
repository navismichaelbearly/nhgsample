/* eslint-disable camelcase */

import { userType } from '../../constants/claims';
import state from '../../../__mocks__/state';

import reducer, {
  displayLogin,
  getHoProfile,
  initialised,
  loginSuccess,
  setProfile,
  startWaiting,
  stopWaiting,
  logout,
  SET_PROFILE,
} from './';

const mock_HOProfile = {
  emailAddress: 'test@test.com',
  fullname: 'Test_1 HO',
  id: 'someId',
  patchName: 'PHSHH',
  team: {
    id: '123',
  },
};

const getState = () => state();

jest.mock('nhh-styles', () => ({
  tokens: {
    customerBaseRoute: 'customerBaseRoute',
  },
}));

jest.mock('../../api', () => ({
  customerApi: {
    getHousingOfficer: () => ({
      data: mock_HOProfile,
    }),
  },
}));

const initialState = {
  foo: 'bar',
};

describe('user reducer', () => {
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

  describe('getHoProfile', () => {
    beforeEach(() => {
      reducer(initialState, getHoProfile('test@test.com')(dispatch, getState));
    });

    it('calls the correct actions', () => {
      expect(dispatch).toHaveBeenCalledWith({
        payload: {
          ...mock_HOProfile,
          isHousingOfficer: true,
        },
        type: SET_PROFILE,
      });
    });
  });

  describe('logout action', () => {
    let result;
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      window.sdk = {
        authService: {
          logout: jest.fn(),
        },
      };
      result = reducer(initialState, logout());
    });

    it('generates the correct state', () => {
      expect(result).toEqual({
        foo: 'bar',
        loggedIn: false,
        profile: null,
      });
    });

    it('calls the Auth logout method', () =>
      expect(window.sdk.authService.logout).toHaveBeenCalledTimes(1));
  });

  describe('displayLogin action', () => {
    let result;
    beforeEach(() => {
      window.sdk = {
        login: jest.fn(),
      };
      result = reducer(initialState, displayLogin());
    });

    it('generates the correct state', () => expect(result).toEqual({ foo: 'bar' }));

    it('calls the Auth login method', () => expect(window.sdk.login).toHaveBeenCalled());
  });

  it('generates the correct state for an initialised action', () => {
    const result = reducer(initialState, initialised());
    expect(result).toEqual({
      foo: 'bar',
      initialised: true,
    });
  });

  it('generates the correct state for a loginSuccess action', () => {
    const id = {
      foo: 'bar',
      [userType]: 'baz',
    };
    const result = reducer(initialState, loginSuccess(id));
    expect(result).toEqual({
      foo: 'bar',
      loggedIn: true,
      id,
      userType: 'baz',
      roles: [],
    });
  });

  it('generates the correct state for a setProfile action', () => {
    const result = reducer(
      initialState,
      setProfile({
        bar: 'baz',
      })
    );
    expect(result).toEqual({
      foo: 'bar',
      loggedIn: true,
      profile: {
        bar: 'baz',
      },
    });
  });

  it('generates the correct state for a startWaiting action', () => {
    const result = reducer(initialState, startWaiting());
    expect(result).toEqual({
      foo: 'bar',
      waiting: true,
    });
  });

  it('generates the correct state for a stopWaiting action', () => {
    const result = reducer(initialState, stopWaiting());
    expect(result).toEqual({
      foo: 'bar',
      waiting: false,
    });
  });
});
