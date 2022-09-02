import features from '../../constants/features';

// Actions
const LOAD_FEATURES = 'features/LOAD_FEATURES';

// Reducers
export default function reducer(state = {}, { type, payload }) {
  switch (type) {
    case LOAD_FEATURES: {
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
export const loadFeatures = () => ({
  type: LOAD_FEATURES,
  payload: features,
});
