import reducer, {
  initialState,
  clearPlanError,
  closePlan,
  createPlan,
  getPlan,
  planLoading,
  planError,
  setPlan,
  SET_PLAN_LOAD,
  SET_PLAN,
} from './';

jest.mock('../../api', () => ({
  arrearsApiV2: {
    createPaymentPlan: (id, payload) => ({ [id]: payload }),
    viewPaymentPlan: () => ({ data: { a: 'b', c: 'd' } }),
    cancelPaymentPlan: () => {},
  },
}));

describe('Payment Plan reducer', () => {
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

  it('should set the correct state for clearPlanError', () => {
    const result = reducer(initialState, clearPlanError());
    expect(result).toMatchSnapshot();
  });

  it('should set the correct state for setPlan', () => {
    const payload = {
      a: 'b',
    };
    const result = reducer(initialState, setPlan(payload));
    expect(result).toMatchSnapshot();
  });

  it('should set the correct state for planError', () => {
    const result = reducer(initialState, planError());
    expect(result).toMatchSnapshot();
  });

  it('should set the correct state for planLoading', () => {
    const result = reducer(initialState, planLoading());
    expect(result).toMatchSnapshot();
  });

  it('should perform the correct actions for closePlan', async () => {
    await closePlan('abc', 'def', { bar: 'baz' })(dispatch);
    expect(dispatch).toBeCalledWith({ type: SET_PLAN_LOAD });
    expect(dispatch).toBeCalled();
  });

  it('should perform the correct actions for createPlan', async () => {
    await createPlan('data', { id: 'baz' })(dispatch);
    expect(dispatch).toBeCalledWith({ type: SET_PLAN_LOAD });
    expect(dispatch).toBeCalledWith({
      type: SET_PLAN,
      payload: { data: { id: 'baz' } },
    });
  });
  it('should perform the correct actions for getPlan', async () => {
    await getPlan('abc', 'def')(dispatch);
    expect(dispatch).toBeCalledWith({ type: SET_PLAN_LOAD });
    expect(dispatch).toBeCalledWith({
      type: SET_PLAN,
      payload: { a: 'b', c: 'd' },
    });
  });
});
