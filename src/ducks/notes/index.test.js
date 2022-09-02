import reducer, {
  addingNote,
  clearNoteError,
  noteAdded,
  noteError,
  addNoteToCase,
  gettingNotes,
  notesRetrieved,
  invalidateNotes,
  ADDING_NOTE,
  NOTE_ADDED,
  NOTE_ERROR,
} from './';
import * as api from '../../api';

jest.mock('uuid/v4', () => () => 'guid');

jest.mock('../../api', () => ({
  notesApi: {
    addNoteToCase: jest.fn(guid => guid === 'fail' && Promise.reject()),
  },
}));

describe('notes reducer', () => {
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
    expect(result).toEqual({ items: [], loaded: false, loading: false, error: false });
  });

  it('returns untouched state by default', () => {
    const result = reducer(currentState, {});
    expect(result).toEqual(currentState);
  });

  it('generates the correct state for a addingNote action', () => {
    const result = reducer(currentState, addingNote());
    expect(result).toEqual({
      foo: 'bar',
      error: false,
      loading: true,
    });
  });

  it('generates the correct state for a addingNote action', () => {
    const result = reducer(currentState, clearNoteError());
    expect(result).toEqual({
      foo: 'bar',
      error: false,
    });
  });

  it('generates the correct state for a noteError action', () => {
    const result = reducer(currentState, noteError());
    expect(result).toEqual({
      foo: 'bar',
      error: true,
      loading: false,
    });
  });

  it('generates the correct state for a noteAdded action', () => {
    const result = reducer(currentState, noteAdded());
    expect(result).toEqual({
      foo: 'bar',
      error: false,
      loading: false,
    });
  });

  it('generates the correct state for getting notes', () => {
    const result = reducer(currentState, gettingNotes());
    expect(result).toEqual({
      foo: 'bar',
      loading: true,
      loaded: false,
    });
  });

  it('generates the correct state for invalidating notes', () => {
    const result = reducer(currentState, invalidateNotes());
    expect(result).toEqual({
      foo: 'bar',
      loading: false,
      loaded: false,
      items: [],
    });
  });

  it('generates the correct state for retrieving notes', () => {
    const result = reducer(currentState, notesRetrieved([{ bar: 'baz' }]));
    expect(result).toEqual({
      foo: 'bar',
      loading: false,
      loaded: true,
      items: [{ bar: 'baz' }],
    });
  });

  it('performs the correct actions for addNoteToCase', async () => {
    const subject = 'a subject';
    const text = 'some text';
    await addNoteToCase('abc123', text, subject)(dispatch);
    expect(dispatch).toBeCalledWith({ type: ADDING_NOTE });
    expect(api.notesApi.addNoteToCase).toBeCalledWith('abc123', { id: 'guid', subject, text });
    expect(dispatch).toBeCalledWith({ type: NOTE_ADDED });
  });

  it('uses a default subject if none is passed', async () => {
    const text = 'some text';
    await addNoteToCase('abc123', text)(dispatch);
    expect(api.notesApi.addNoteToCase).toBeCalledWith('abc123', {
      id: 'guid',
      subject: 'Note added via Arrears',
      text,
    });
  });

  it('performs the correct actions for addNoteToCase when an error is thrown', async () => {
    const subject = 'a subject';
    const text = 'some text';
    expect.assertions(1);
    await addNoteToCase(
      'fail',
      text,
      subject
    )(dispatch).catch(() => {
      expect(dispatch).toBeCalledWith({ type: NOTE_ERROR });
    });
  });
});
