import { arrearsApi } from '../../api';
import reducer, {
  initialState,
  setError,
  setLoading,
  setLegalReferral,
  getLegalReferral,
  approveLegalReferral,
  cancelLegalReferral,
  clear,
  SET_ERROR,
  SET_LEGAL_REFERRAL,
  SET_LEGAL_REFERRAL_STATE,
  SET_LOADING,
} from './';

jest.mock('../../api', () => ({
  arrearsApi: {
    approveLegalReferral: jest.fn(),
    cancelLegalReferral: jest.fn(),
    getLegalReferral: jest.fn(id =>
      id === 'fail' ? Promise.reject({ response: { status: 500 } }) : { data: { id, bar: 'baz' } }
    ),
  },
}));

describe('legalReferral reducer', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set a default state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('returns untouched state by default', () => {
    const result = reducer(initialState, {});
    expect(result).toEqual(initialState);
  });

  it('generates the correct state for a setError action', () => {
    const result = reducer(initialState, setError(500));
    expect(result).toEqual({
      ...initialState,
      error: true,
      errorStatus: 500,
    });
  });

  it('generates the correct state for a setLoading action', () => {
    const result = reducer(initialState, setLoading());
    expect(result).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('generates the correct state for a setLegalReferral action', () => {
    const result = reducer(initialState, setLegalReferral({ foo: 'bar' }));
    expect(result).toEqual({
      ...initialState,
      detail: { foo: 'bar' },
    });
  });

  it('performs the correct actions for getLegalReferral', async () => {
    await getLegalReferral('abc123')(dispatch);
    expect(dispatch).toBeCalledWith({ type: SET_LOADING });
    expect(arrearsApi.getLegalReferral).toBeCalledWith('abc123');
    expect(dispatch).toBeCalledWith({
      type: SET_LEGAL_REFERRAL,
      payload: { id: 'abc123', bar: 'baz' },
    });
  });

  it('performs the correct actions for getLegalReferral when an error is thrown', async () => {
    await getLegalReferral('fail')(dispatch);
    expect(dispatch).toBeCalledWith({ type: SET_ERROR, payload: 500 });
  });

  it('performs the correct actions for approveLegalReferral', async () => {
    await approveLegalReferral('abc123', 'state')(dispatch);
    expect(dispatch).toBeCalledWith({ type: SET_LOADING });
    expect(arrearsApi.approveLegalReferral).toBeCalledWith('abc123');
    expect(dispatch).toBeCalledWith({
      type: SET_LEGAL_REFERRAL_STATE,
      payload: 'state',
    });
  });

  it('performs the correct actions for cancelLegalReferral', async () => {
    await cancelLegalReferral('abc123', { foo: 'bar' })(dispatch);
    expect(dispatch).toBeCalledWith({ type: SET_LOADING });
    expect(arrearsApi.cancelLegalReferral).toBeCalledWith('abc123', { foo: 'bar' });
    expect(dispatch).toBeCalledWith({
      type: SET_LEGAL_REFERRAL_STATE,
      payload: 'cancelled',
    });
  });

  it('performs the correct actions for clear form', () => {
    const result = reducer(initialState, clear());
    expect(result).toEqual({
      ...initialState,
      loading: true,
      error: false,
      errorStatus: undefined,
      detail: undefined,
    });
  });
});
