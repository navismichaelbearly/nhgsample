import reducer, {
  initialState,
  clearInteractionError,
  interactionError,
  interactionLoading,
  setActivityTypes,
  setInteraction,
  createInteraction,
  getActivityTypes,
  SET_INTERACTION,
  SET_INTERACTION_ERROR,
  SET_ACTIVITY_TYPES,
  getThirdPartiesContact,
  SET_THIRD_PARTY,
  SET_THIRD_PARTY_ERROR,
} from './';

jest.mock('../../api', () => ({
  interactionsApi: {
    getActivityTypes: withError =>
      withError
        ? Promise.reject({ response: { status: 500 } })
        : { data: [{ id: 'a', name: 'item' }] },
    createInteraction: (id, payload) => ({ [id]: payload }),
  },
  correspondenceApi: {
    getThirdPartyRecipients: withError =>
      withError
        ? Promise.reject({ response: { status: 500 } })
        : { data: [{ id: 'a', name: 'item' }] },
  },
}));

const activityTypes = [
  {
    id: 0,
    name: 'Email',
  },
  {
    id: 1,
    name: 'InPerson',
  },
  {
    id: 2,
    name: 'Letter',
  },
  {
    id: 3,
    name: 'Messaging',
  },
  {
    id: 4,
    name: 'PhoneCall',
  },
  {
    id: 5,
    name: 'Voicemail',
  },
];

describe('interactions reducer', () => {
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

  it('should set the correct state for clearInteractionError', () => {
    const result = reducer(initialState, clearInteractionError());
    expect(result).toMatchSnapshot();
  });

  it('should set the correct state for interactionError', () => {
    const payload = {
      a: 'b',
    };
    const result = reducer(initialState, interactionError(payload));
    expect(result).toMatchSnapshot();
  });

  it('should set the correct state for interactionLoading', () => {
    const result = reducer(initialState, interactionLoading());
    expect(result).toMatchSnapshot();
  });

  it('should set the correct state for setActivityTypes', () => {
    const result = reducer(initialState, setActivityTypes(activityTypes));
    expect(result).toMatchSnapshot();
  });

  it('should set the correct state for setInteraction', () => {
    const result = reducer(initialState, setInteraction({ a: 'b' }));
    expect(result).toMatchSnapshot();
  });

  it('should perform the correct actions for createInteraction', async () => {
    const arrearId = 'abd';
    const payload = { a: 'b' };
    await createInteraction(arrearId, payload)(dispatch);
    expect(dispatch).toBeCalledWith({ type: SET_INTERACTION, payload: { [arrearId]: payload } });
    expect(dispatch).toBeCalled();
  });

  it('should perform the correct actions for getActivityTypes', async () => {
    await getActivityTypes()(dispatch);
    expect(dispatch).toBeCalledWith({
      type: SET_ACTIVITY_TYPES,
      payload: [{ id: 'a', name: 'item' }],
    });
  });

  describe('getActivityTypes error', () => {
    it('should perform the correct actions for getActivityTypes in case of an error', async () => {
      await getActivityTypes(true)(dispatch).catch(() => {
        expect(dispatch).toBeCalledWith({ type: SET_INTERACTION_ERROR });
      });
    });
  });

  it('should perform the correct actions for getThirdPartiesContact', async () => {
    await getThirdPartiesContact()(dispatch);
    expect(dispatch).toBeCalledWith({
      type: SET_THIRD_PARTY,
      payload: [{ id: 'a', name: 'item' }],
    });
  });

  it('should perform the correct actions when getThirdPartiesContact fails', async () => {
    await getThirdPartiesContact(true)(dispatch);
    expect(dispatch).toBeCalledWith({
      type: SET_THIRD_PARTY_ERROR,
    });
  });
});
