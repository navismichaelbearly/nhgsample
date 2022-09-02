import reducer, {
  clearSearch,
  searching,
  housingOfficersFound,
  requestError,
  search,
  SEARCHING,
  RESULTS,
  REQUEST_ERROR,
} from './';
import * as api from '../../api';
import state from '../../../__mocks__/state';

jest.mock('../../api', () => ({
  customerApi: {
    searchForHousingOfficers: jest.fn(searchTerm =>
      searchTerm === 'fail'
        ? Promise.reject()
        : Promise.resolve({ data: [{ id: 1, fullname: 'RESULT' }] })
    ),
  },
}));

describe('housingofficersearch reducer', () => {
  let dispatch;
  let currentState;

  beforeEach(() => {
    currentState = { foo: 'bar' };
    dispatch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses default initial state if no state passed', () => {
    const result = reducer(undefined, {});
    expect(result).toEqual({ error: false, loading: false, searchResults: [] });
  });

  it('returns untouched state by default', () => {
    const result = reducer(currentState, {});
    expect(result).toEqual(currentState);
  });

  it('generates the correct state for a clearSearch action', () => {
    const result = reducer(currentState, clearSearch());
    expect(result).toEqual({
      ...currentState,
      searchResults: [],
    });
  });

  it('generates the correct state for a searching action', () => {
    const result = reducer(currentState, searching());
    expect(result).toEqual({
      ...currentState,
      error: false,
      loading: true,
    });
  });

  it('generates the correct state for a requestError action', () => {
    const result = reducer(currentState, requestError());
    expect(result).toEqual({
      ...currentState,
      error: true,
      loading: false,
    });
  });

  it('generates the correct state for a housingOfficersFound  action', () => {
    const searchResults = state().housingofficersearch.searchResults;
    const result = reducer(currentState, housingOfficersFound(searchResults));
    expect(result).toEqual({
      ...currentState,
      error: false,
      loading: false,
      searchResults: [
        {
          fullName: "Aisling O'Flaherty",
          id: '01973660-bd18-e811-80c8-005056825b41',
        },

        {
          fullName: 'Akima Fraser Bailey',
          id: '03973660-bd18-e811-80c8-005056825b41',
        },
        {
          fullName: 'Ayesha Pettifor',
          id: '37973660-bd18-e811-80c8-005056825b41',
        },
      ],
    });
  });

  it('performs the correct actions for search', async () => {
    const searchTerm = 'SEARCH_TERM';

    await search(searchTerm)(dispatch);

    expect(dispatch).toBeCalledWith({ type: SEARCHING });
    expect(api.customerApi.searchForHousingOfficers).toBeCalledWith(searchTerm);

    expect(dispatch).toBeCalledWith({
      type: RESULTS,
      searchResults: [{ id: 1, fullName: 'RESULT' }],
    });
  });

  it('performs the correct actions for search when an error is thrown', async () => {
    expect.assertions(1);
    await search('fail')(dispatch).catch(() => {
      expect(dispatch).toBeCalledWith({ type: REQUEST_ERROR });
    });
  });
});
