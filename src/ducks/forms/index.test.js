import formSdk from '../../util/formSdk';
import reducer, {
  initialState,
  formSubmitted,
  clearSubmissions,
  createSubmission,
  generateNewSubmissionId,
  setError,
  setFormRendered,
  setLoading,
  setSubmission,
  SET_LOADING,
  SET_SUBMISSION,
} from './';

jest.mock('../../util/formSdk', () => ({
  createNewSubmissionByName: jest.fn(name => Promise.resolve(`${name}-submission`)),
  enableForCustomer: jest.fn(),
  api: {
    submissions: {
      getInProgressSubmissionsByFormName: jest.fn(),
    },
  },
}));

describe('Forms reducer', () => {
  let dispatch;
  let getState;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = () => ({ forms: { abc: { id: 'formId' } } });
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

  it('generates the correct state for a formSubmitted() action', () => {
    const result = reducer(initialState, formSubmitted());
    expect(result).toEqual({
      ...initialState,
      formSubmitted: true,
    });
  });

  it('generates the correct state for a setError action', () => {
    const result = reducer(initialState, setError());
    expect(result).toEqual({
      ...initialState,
      error: true,
      loading: false,
    });
  });

  it('generates the correct state for a setFormRendered action', () => {
    const result = reducer(initialState, setFormRendered());
    expect(result).toEqual({
      ...initialState,
      formRendered: true,
    });
  });

  it('generates the correct state for a setLoading action', () => {
    const result = reducer(initialState, setLoading());
    expect(result).toEqual({
      ...initialState,
      error: false,
      loading: true,
    });
  });

  it('generates the correct state for a clearSubmissions action', () => {
    const result = reducer({ abc: { submissions: ['abc'] } }, clearSubmissions('abc'));
    expect(result).toEqual({
      ...initialState,
      error: false,
      loading: false,
      formRendered: false,
      abc: {
        submissions: [],
      },
    });
  });

  it('generates the correct state for a setSubmission action', () => {
    const result = reducer({ abc: { submissions: ['123'] } }, setSubmission('abc', '456'));
    expect(result).toEqual({
      ...initialState,
      error: false,
      formSubmitted: false,
      loading: false,
      abc: {
        submissions: ['123', '456'],
      },
    });
  });

  it('loads the latest in progress submission when started', async () => {
    formSdk.api.submissions.getInProgressSubmissionsByFormName = jest.fn(() =>
      Promise.resolve({ data: [{ submissionId: 'some-new-sub-id' }] })
    );
    await createSubmission('formName', '123')(dispatch, getState);
    expect(dispatch).toBeCalledWith({ type: SET_LOADING });
    expect(formSdk.enableForCustomer).toBeCalledWith('123');

    expect(formSdk.api.submissions.getInProgressSubmissionsByFormName).toBeCalledWith(
      'formName',
      '123'
    );
    expect(dispatch).toBeCalledWith({
      type: SET_SUBMISSION,
      payload: {
        formName: 'formName',
        submissionId: 'some-new-sub-id',
      },
    });
  });

  it('performs the correct actions for createSubmission', async () => {
    formSdk.api.submissions.getInProgressSubmissionsByFormName = jest.fn(() =>
      Promise.resolve({ data: [] })
    );
    await createSubmission('formName', '123')(dispatch, getState);
    expect(dispatch).toBeCalledWith({ type: SET_LOADING });
    expect(formSdk.enableForCustomer).toBeCalledWith('123');
    expect(formSdk.createNewSubmissionByName).toBeCalledWith('formName');
    expect(formSdk.api.submissions.getInProgressSubmissionsByFormName).toBeCalledWith(
      'formName',
      '123'
    );
    expect(dispatch).toBeCalledWith({
      type: SET_SUBMISSION,
      payload: {
        formName: 'formName',
        submissionId: 'formName-submission',
      },
    });
  });

  it('performs the correct actions for generateNewSubmissionId', async () => {
    formSdk.api.submissions.getInProgressSubmissionsByFormName = jest.fn(() =>
      Promise.resolve({ data: [] })
    );

    await generateNewSubmissionId('formName', '123')(dispatch, getState);
    expect(formSdk.enableForCustomer).toBeCalledWith('123');
    expect(formSdk.createNewSubmissionByName).toBeCalledWith('formName');
    expect(dispatch).toBeCalledWith({
      type: SET_SUBMISSION,
      payload: {
        formName: 'formName',
        submissionId: 'formName-submission',
      },
    });
  });
});
