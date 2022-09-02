// Actions
export const SHOW_MODAL = 'modal/SHOW';
export const HIDE_MODAL = 'modal/HIDE';
export const SET_CONTENT = 'modal/SET_CONTENT';

const initialState = {
  visible: false,
  content: '',
};

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SHOW_MODAL:
    case HIDE_MODAL:
    case SET_CONTENT: {
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
export const showModal = () => ({
  type: SHOW_MODAL,
  payload: { visible: true },
});

export const hideModal = () => ({
  type: HIDE_MODAL,
  payload: { visible: false },
});

export const setContent = (content, extendStyle) => ({
  type: SET_CONTENT,
  payload: { content, extendStyle },
});

export const setModalContent = (content, extendStyle = null) => dispatch =>
  new Promise(resolve => {
    dispatch(setContent(content, extendStyle));
    if (content) {
      dispatch(showModal());
    } else {
      dispatch(hideModal());
    }
    resolve();
  });
