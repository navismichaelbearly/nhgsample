import clone from 'ramda/src/clone';
import concat from 'ramda/src/concat';
// Actions

export const ADD_NOTIFICATION = 'notification/ADD';
export const REMOVE_NOTIFICATION = 'notification/REMOVE';

export const initialState = {
  items: [],
};

const notificationItemDefault = {
  description: '',
  title: '',
  lines: [],
  notificationType: '',
};

const addOrReplace = (notifications, item) => {
  let items = clone(notifications);

  if (items.find(localItem => localItem.notificationType === item.notificationType)) {
    items = items.map(localItem =>
      localItem.type === item.type ? { ...notificationItemDefault, ...item } : localItem
    );
  } else {
    items = concat(items, [{ ...notificationItemDefault, ...item }]);
  }

  return items;
};

const sort = items => items.sort(a => (a.notificationType === 'confirmation' ? -1 : 1));

// Reducers
export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case ADD_NOTIFICATION:
      return {
        ...state,
        items: sort(addOrReplace(state.items, payload)),
      };
    case REMOVE_NOTIFICATION:
      return {
        ...state,
        items: sort(
          payload.notificationType
            ? state.items.filter(item => item.notificationType !== payload.notificationType)
            : []
        ),
      };

    default:
      return state;
  }
}

// Dispatches

export const addNotification = payload => ({
  type: ADD_NOTIFICATION,
  payload,
});

export const removeNotification = notificationType => ({
  type: REMOVE_NOTIFICATION,
  payload: { notificationType },
});
