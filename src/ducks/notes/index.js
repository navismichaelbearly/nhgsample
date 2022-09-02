import uuid from 'uuid/v4';

import { notesApi } from '../../api';

// Actions
export const ADDING_NOTE = 'notes/ADDING_NOTE';
export const CLEAR_NOTE_ERROR = 'notes/CLEAR_NOTE_ERROR';
export const NOTE_ADDED = 'notes/NOTE_ADDED';
export const NOTE_ERROR = 'notes/NOTE_ERROR';
export const GETTING_NOTES = 'notes/GETTING_NOTES';
export const NOTES_RETRIEVED = 'notes/NOTES_RETRIEVED';
export const INVALIDATE_NOTES = 'notes/INVALIDATE_NOTES';

const initialState = { items: [], loading: false, loaded: false, error: false };

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case ADDING_NOTE: {
      return {
        ...state,
        error: false,
        loading: true,
      };
    }

    case CLEAR_NOTE_ERROR: {
      return {
        ...state,
        error: false,
      };
    }

    case NOTE_ADDED: {
      return {
        ...state,
        error: false,
        loading: false,
      };
    }

    case NOTE_ERROR: {
      return {
        ...state,
        error: true,
        loading: false,
      };
    }

    case GETTING_NOTES: {
      return {
        ...state,
        loading: true,
        loaded: false,
      };
    }

    case NOTES_RETRIEVED: {
      return {
        ...state,
        loading: false,
        loaded: true,
        items: payload,
      };
    }

    case INVALIDATE_NOTES: {
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const addingNote = () => ({
  type: ADDING_NOTE,
});

export const clearNoteError = () => ({
  type: CLEAR_NOTE_ERROR,
});

export const noteAdded = () => ({
  type: NOTE_ADDED,
});

export const noteError = () => ({
  type: NOTE_ERROR,
});

export const gettingNotes = () => ({
  type: GETTING_NOTES,
});

export const notesRetrieved = payload => ({
  type: NOTES_RETRIEVED,
  payload,
});

export const invalidateNotes = () => ({
  type: INVALIDATE_NOTES,
});

export const addNoteToCase = (
  caseId,
  text,
  subject = 'Note added via Arrears'
) => async dispatch => {
  dispatch(addingNote());
  try {
    const id = uuid();
    await notesApi.addNoteToCase(caseId, { id, subject, text });
    dispatch(noteAdded());
    return id;
  } catch (error) {
    dispatch(noteError());
    throw new Error(error);
  }
};

export const getNotesByCaseId = caseId => async dispatch => {
  dispatch(invalidateNotes());
  dispatch(gettingNotes());
  try {
    const { data } = await notesApi.getNoteById(caseId, 'cases');
    dispatch(notesRetrieved(data));
  } catch (e) {
    dispatch(noteError());
  }
};
