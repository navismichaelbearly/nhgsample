import { activitiesApi, interactionsApi, arrearsApi, paymentsApi } from '../../api';
import getAttachmentsFromId from '../../util/getAttachmentsList';

import reducer, {
  initialState,
  setError,
  setLoading,
  setActivityHistory,
  getActivityHistory,
  setActivityDetail,
  getActivity,
  INVALIDATE_ACTIVITY_DETAIL,
  SET_ERROR,
  SET_ACTIVITY_DETAIL,
  SET_ACTIVITY_HISTORY,
  SET_LOADING,
  SET_ATTACHMENTS_LOADING,
  SET_ATTACHMENTS,
  SET_ATTACHMENTS_ERROR,
} from './';

import mockState from '../../../__mocks__/state';

jest.mock('../../util/getAttachmentsList', () =>
  jest.fn((type, id) =>
    id === 'fail' ? Promise.reject() : Promise.resolve({ data: { type, id, bar: 'baz' } })
  )
);

jest.mock('../../api', () => ({
  activitiesApi: {
    getCaseHistoryWithQueryParams: jest.fn(id =>
      id === 'fail' ? Promise.reject() : { data: { id, bar: 'baz' } }
    ),
  },
  interactionsApi: {
    getDataFromUrl: jest.fn(url =>
      url === 'fail' ? Promise.reject() : { data: { url, bar: 'baz' } }
    ),
  },
  arrearsApi: {
    getDataFromUrl: jest.fn(url =>
      url === 'fail' ? Promise.reject() : { data: { url, bar: 'baz' } }
    ),
  },
  paymentsApi: {
    getDataFromUrl: jest.fn(url =>
      url === 'fail' ? Promise.reject() : { data: { url, bar: 'baz' } }
    ),
  },
}));

describe('activites reducer', () => {
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
    const result = reducer(initialState, setError());
    expect(result).toEqual({
      ...initialState,
      error: true,
    });
  });

  it('generates the correct state for a setLoading action', () => {
    const result = reducer(initialState, setLoading());
    expect(result).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('generates the correct state for a setActivityHistory action', () => {
    const result = reducer(initialState, setActivityHistory([{ foo: 'bar' }]));
    expect(result).toEqual({
      ...initialState,
      history: [{ foo: 'bar' }],
    });
  });

  it('generates the correct state for a setActivityDetail action', () => {
    const result = reducer(initialState, setActivityDetail({ foo: 'bar' }));
    expect(result).toEqual({
      ...initialState,
      detail: { foo: 'bar' },
    });
  });

  it('performs the correct actions for getActivityHistory', async () => {
    await getActivityHistory('abc123')(dispatch);
    expect(dispatch).toBeCalledWith({ type: SET_LOADING });
    expect(activitiesApi.getCaseHistoryWithQueryParams).toBeCalledWith('abc123', {
      notificationSent: true,
    });
    expect(dispatch).toBeCalledWith({
      type: SET_ACTIVITY_HISTORY,
      payload: { id: 'abc123', bar: 'baz' },
    });
  });

  it('performs the correct actions for getActivityHistory when an error is thrown', async () => {
    expect.assertions(1);
    await getActivityHistory('fail')(dispatch).catch(() => {
      expect(dispatch).toBeCalledWith({ type: SET_ERROR });
    });
  });

  it('performs the correct actions when there is an activities detail', async () => {
    await getActivity({ link: { service: 'interactions/web', path: 'URL' } })(dispatch, mockState);
    expect(dispatch).toBeCalledWith({
      type: INVALIDATE_ACTIVITY_DETAIL,
    });
  });

  it('performs the correct actions when called getActivity for an interaction', async () => {
    await getActivity({ link: { service: 'interactions/web', path: 'URL' }, id: 'asimpleid' })(
      dispatch,
      mockState
    );
    expect(dispatch).toBeCalledWith({ type: SET_LOADING });
    expect(interactionsApi.getDataFromUrl).toBeCalledWith('URL');
    expect(dispatch).toBeCalledWith({
      payload: { bar: 'baz', type: 'Interaction', url: 'URL' },
      type: SET_ACTIVITY_DETAIL,
    });
    expect(dispatch).toBeCalledWith({ type: SET_ATTACHMENTS_LOADING });
    expect(getAttachmentsFromId).toBeCalledWith('Interaction', 'asimpleid');
    expect(dispatch).toBeCalledWith({
      payload: { bar: 'baz', id: 'asimpleid', type: 'Interaction' },
      type: SET_ATTACHMENTS,
    });
  });

  it('performs the correct actions when called getActivity for an interaction but the get attachments fail', async () => {
    await getActivity({ link: { service: 'interactions/web', path: 'URL' }, id: 'fail' })(
      dispatch,
      mockState
    );
    expect(dispatch).toBeCalledWith({ type: SET_LOADING });
    expect(interactionsApi.getDataFromUrl).toBeCalledWith('URL');
    expect(dispatch).toBeCalledWith({
      payload: { bar: 'baz', type: 'Interaction', url: 'URL' },
      type: SET_ACTIVITY_DETAIL,
    });
    expect(dispatch).toBeCalledWith({ type: SET_ATTACHMENTS_LOADING });
    expect(getAttachmentsFromId).toBeCalledWith('Interaction', 'fail');
    expect(dispatch).toBeCalledWith({
      type: SET_ATTACHMENTS_ERROR,
    });
  });

  it('performs the correct actions when called getActivity for a Referral', async () => {
    await getActivity({
      link: { service: 'arrears/web', path: 'URL' },
      type: 'Referral',
      id: 'abc123',
    })(dispatch, mockState);
    expect(dispatch).toBeCalledWith({ type: SET_LOADING });
    expect(arrearsApi.getDataFromUrl).toBeCalledWith('URL');
    expect(dispatch).toBeCalledWith({
      payload: { bar: 'baz', url: 'URL', type: 'Referral' },
      type: SET_ACTIVITY_DETAIL,
    });
  });

  it('performs the correct actions when called getActivity for a payment', async () => {
    await getActivity({ link: { service: 'payments/web', path: 'URL' } })(dispatch, mockState);
    expect(dispatch).toBeCalledWith({ type: SET_LOADING });
    expect(paymentsApi.getDataFromUrl).toBeCalledWith('URL');
    expect(dispatch).toBeCalledWith({
      payload: { bar: 'baz', type: 'Payment', url: 'URL' },
      type: SET_ACTIVITY_DETAIL,
    });
  });
});
