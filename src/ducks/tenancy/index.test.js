import reducer, {
  gettingTenancy,
  getTenancy,
  patchTenant,
  setTenancy,
  setError,
  GETTING_TENANCY,
  SET_TENANCY,
} from './';

jest.mock('../../api', () => ({
  customerApi: {
    getTenancy: id => ({
      data: { id },
    }),
  },
}));

const state = {
  foo: 'bar',
};

describe('tenancy reducer', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses default initial state if no state passed', () => {
    const result = reducer(undefined, {});
    expect(result).toEqual({
      error: false,
      loadingTenancy: false,
      tenants: [],
    });
  });

  it('returns untouched state by default', () => {
    const result = reducer(state, {});
    expect(result).toEqual(state);
  });

  it('generates the correct state for a gettingTenancy action', () => {
    const result = reducer(state, gettingTenancy());
    expect(result).toEqual({
      foo: 'bar',
      loadingTenancy: true,
    });
  });

  it('generates the correct state for a setError action', () => {
    const result = reducer(state, setError());
    expect(result).toEqual({
      foo: 'bar',
      error: true,
      loadingTenancy: false,
    });
  });

  it('generates the correct state for a setTenancy action', () => {
    const result = reducer(state, setTenancy({ bar: 'baz' }));
    expect(result).toEqual({
      foo: 'bar',
      bar: 'baz',
      loadingTenancy: false,
    });
  });

  it('generates the correct state for a patchTenant action', () => {
    const newState = {
      ...state,
      tenants: [
        { contactId: 'abc123', email: 'bob@test.com', foo: 'bar' },
        { contactId: 'def456', email: 'fred@test.com', foo: 'bar' },
      ],
    };
    const result = reducer(newState, patchTenant({ contactId: 'def456', email: 'test@test.com' }));
    expect(result).toEqual({
      foo: 'bar',
      tenants: [
        { contactId: 'abc123', email: 'bob@test.com', foo: 'bar' },
        { contactId: 'def456', email: 'test@test.com', foo: 'bar' },
      ],
      loadingTenancy: false,
    });
  });

  it('performs the correct actions for getTenancy', async () => {
    await getTenancy('abc')(dispatch);
    expect(dispatch).toBeCalledWith({ type: GETTING_TENANCY });
    expect(dispatch).toBeCalledWith({
      type: SET_TENANCY,
      payload: { id: 'abc' },
    });
  });
});
