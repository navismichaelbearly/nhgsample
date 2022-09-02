import reducer, {
  clearNOSPError,
  getArrearsSummary,
  gettingArrears,
  setArrears,
  serveNOSP,
  serveNOSPError,
  setFilters,
  getStatuses,
  getArrearsStatistics,
  setArrearsDetail,
  getArrearsDetail,
  updateFiltersAndFetchResults,
  initialState,
  GETTING_ARREARS,
  GETTING_ARREARS_STATS,
  SET_ARREARS,
  SET_ARREARS_DETAIL,
  SET_ARREARS_STATS,
  SET_FILTERS,
  SET_STATUSES,
  SERVE_NOSP,
  SERVE_NOSP_LOADING,
} from './';

jest.mock('../../api', () => ({
  arrearsApiV2: {
    getArrearsDetail: id => ({
      data: { id, bar: 'baz' },
    }),
    getStatuses: params => ({
      data: [{ id: 'foo', ...params }],
    }),
    getArrearsSummary: params => ({
      data: [{ id: 'foo', ...params }],
    }),
    getArrearsStats: () => ({
      data: {
        a: 'b',
        c: 'd',
      },
    }),
    serveNOSP: () => {},
  },
}));

const populatedState = {
  arrears: {
    filters: {
      foo: 'bar',
    },
  },
};

describe('arrears reducer', () => {
  let dispatch;
  let state;

  beforeEach(() => {
    dispatch = jest.fn();
    state = {
      foo: 'bar',
      items: [],
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses default initial state if no state passed', () => {
    const result = reducer(undefined, {});
    expect(result).toEqual(initialState);
  });

  it('returns untouched state by default', () => {
    const result = reducer(state, {});
    expect(result).toEqual(state);
  });

  it('generates the correct state for a gettingArrears action', () => {
    const result = reducer(state, gettingArrears());
    expect(result).toEqual({
      foo: 'bar',
      items: [],
      loadingArrears: true,
    });
  });

  it('generates the correct state for a setArrears action', () => {
    const result = reducer(state, setArrears({ data: [{ id: 'foo', bar: 'baz' }] }));
    expect(result).toEqual({
      foo: 'bar',
      loadingArrears: false,
      items: [{ id: 'foo', bar: 'baz' }],
    });
  });

  it('generates the correct state for a setArrears action with a page param', () => {
    const result = reducer(
      { ...state, items: [{ id: 'foo', bar: 'baz' }] },
      setArrears({ data: [{ id: 'bar', bar: 'foo' }], page: 2 })
    );
    expect(result).toEqual({
      foo: 'bar',
      loadingArrears: false,
      items: [
        { id: 'foo', bar: 'baz' },
        { id: 'bar', bar: 'foo' },
      ],
    });
  });

  it('generates the correct state for a clearNOSPError action', () => {
    const result = reducer(state, clearNOSPError());
    expect(result).toEqual({
      foo: 'bar',
      nospServeError: false,
      items: [],
    });
  });

  it('generates the correct state for a serveNOSPError action', () => {
    const result = reducer(state, serveNOSPError());
    expect(result).toEqual({
      foo: 'bar',
      nospServeError: true,
      items: [],
      nospLoading: false,
    });
  });

  it('generates the correct state for a setFilters action', () => {
    const result = reducer(
      state,
      setFilters({ opts: { foo: 'bar' }, item: { count: 10, label: 'Foo' } })
    );
    expect(result).toEqual({
      foo: 'bar',
      filterLabel: 'Foo',
      filters: { foo: 'bar' },
      items: [],
      resultsCount: 10,
    });
  });

  it('performs the correct actions for getArrearsDetail', async () => {
    await getArrearsDetail('foo')(dispatch);
    expect(dispatch).toBeCalledWith({ type: GETTING_ARREARS });
    expect(dispatch).toBeCalledWith({
      type: SET_ARREARS_DETAIL,
      payload: { detail: { id: 'foo', bar: 'baz' }, id: 'foo' },
    });
  });

  it('performs the correct actions for getStatuses', async () => {
    await getStatuses({})(dispatch);
    expect(dispatch).toBeCalledWith({
      payload: [{ id: 'foo' }],
      type: SET_STATUSES,
    });
  });

  it('performs the correct actions for getArrearsStats', async () => {
    await getArrearsStatistics('patch')(dispatch);
    expect(dispatch).toBeCalledWith({ type: GETTING_ARREARS_STATS });
    expect(dispatch).toBeCalledWith({
      type: SET_ARREARS_STATS,
      payload: { a: 'b', c: 'd' },
    });
  });

  it('performs the correct actions for getArrearsSummary', async () => {
    await getArrearsSummary({ patches: 'abc' })(dispatch, () => populatedState);
    const filters = populatedState.arrears.filters;
    expect(dispatch).toBeCalledWith({ type: GETTING_ARREARS });
    expect(dispatch).toBeCalledWith({
      type: SET_ARREARS,
      payload: {
        data: [
          { id: 'foo', ...filters, patches: 'abc', sort: 'priority', count: 6, pageNumber: 1 },
        ],
      },
    });
  });

  it('performs the correct actions for getArrearsSummary with page param', async () => {
    await getArrearsSummary({ patches: 'abc', pageNumber: 2 })(dispatch, () => populatedState);
    const filters = populatedState.arrears.filters;
    expect(dispatch).toBeCalledWith({ type: GETTING_ARREARS });
    expect(dispatch).toBeCalledWith({
      type: SET_ARREARS,
      payload: {
        data: [
          { id: 'foo', ...filters, patches: 'abc', sort: 'priority', count: 6, pageNumber: 2 },
        ],
        page: 2,
      },
    });
  });

  it('performs the correct actions for updateFiltersAndFetchResults', async () => {
    await updateFiltersAndFetchResults({ foo: 'bar' }, { count: 10, label: 'Foo' })(dispatch);
    expect(dispatch).toBeCalledWith({
      type: SET_FILTERS,
      payload: {
        item: { count: 10, label: 'Foo' },
        opts: { foo: 'bar' },
      },
    });
  });

  describe('setArrearsDetail action', () => {
    it('creates new item if it does not already exist', () => {
      const result = reducer(
        state,
        setArrearsDetail({ id: 'foo', detail: { id: 'foo', bar: 'baz' } })
      );
      expect(result).toEqual({
        foo: 'bar',
        loadingArrears: false,
        items: [{ id: 'foo', bar: 'baz', allDetails: true }],
      });
    });

    it('extends item if it does already exist', () => {
      const newState = {
        foo: 'bar',
        loadingArrears: false,
        items: [{ id: 'foo', bar: 'baz' }],
      };
      const result = reducer(
        newState,
        setArrearsDetail({ id: 'foo', detail: { id: 'foo', foo: 'bar' } })
      );
      expect(result).toEqual({
        foo: 'bar',
        loadingArrears: false,
        items: [{ id: 'foo', bar: 'baz', foo: 'bar', allDetails: true }],
      });
    });
  });

  it('performs the correct actions for serveNOSP', async () => {
    const arrearsId = 'arrearsId';
    await serveNOSP(arrearsId)(dispatch);
    expect(dispatch).toBeCalledWith({
      type: SERVE_NOSP_LOADING,
    });
    expect(dispatch).toBeCalledWith({
      type: SERVE_NOSP,
    });
  });
});
