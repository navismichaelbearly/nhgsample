// Actions
const LOAD_STRINGS = 'dictionary/LOAD_STRINGS';

// Reducers
export default function reducer(state = {}, { type, payload }) {
  switch (type) {
    case LOAD_STRINGS: {
      return {
        ...state,
        ...payload,
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const loadStrings = payload => ({
  type: LOAD_STRINGS,
  payload,
});
