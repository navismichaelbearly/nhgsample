// Actions
const SET_ENTRY_POINT = 'navigation/SET_ENTRY_POINT';

// Reducers
export default function reducer(state = {}, { type, payload }) {
  switch (type) {
    case SET_ENTRY_POINT: {
      return {
        ...state,
        entryPoint: payload,
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const setEntryPoint = payload => ({
  type: SET_ENTRY_POINT,
  payload,
});
