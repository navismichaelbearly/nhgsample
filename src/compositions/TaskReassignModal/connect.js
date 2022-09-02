import { connect } from 'react-redux';
import format from 'string-format';
import pickAll from 'ramda/src/pickAll';
import { isUserSeniorManager } from '../../util/userRoles';
import getHelpers from '../../util/stateHelpers';

import { clearSearch, search } from '../../ducks/housingofficersearch';
import { setModalContent } from '../../ducks/modal';
import { addNotification } from '../../ducks/notifications';
import { clearActionErrors, getTasks, reassignTask } from '../../ducks/tasks';
import scrolltoTop from '../../util/scrolltoTop';

export const mapStateToProps = state => {
  const { get } = getHelpers(state);
  const {
    taskActionModal: { errorText, labels, notification, taskReassign },
  } = state.dictionary;
  const modalActionError = get(['tasks', 'modalActionError']);
  const isLoading = get(['tasks', 'loading']);

  return {
    errorText,
    labels,
    searchResults: get(['housingofficersearch', 'searchResults']) || [],
    serverError: modalActionError ? errorText.formError : '',
    notification,
    taskReassign,
    isLoading,
    user: pickAll(['roles'], get(['user'])),
  };
};

export const mergeProps = (
  { notification, searchResults, user, ...stateProps },
  { dispatch },
  { arrearsId, task, ...ownProps }
) => ({
  ...stateProps,
  searchResults,
  onCancel: () => {
    dispatch(setModalContent());
  },
  onSubmit: ({ ownerId, taskedAssignedTo, reason }) => {
    const { id } = task;
    const params = { ownerId, reason };
    dispatch(reassignTask(id, params))
      .then(() => {
        dispatch(setModalContent());
        dispatch(
          getTasks({
            EntityId: arrearsId,
            EntityType: 'Arrears',
            Statuses: 'Open',
            skipFetchRoles: isUserSeniorManager(user.roles),
          })
        );
        dispatch(
          addNotification({
            dataBddPrefix: 'reassignTask',
            lines: [
              {
                text: format(notification.newOwner, {
                  ownerName: taskedAssignedTo,
                }),
              },
            ],
            icon: 'success',
            notificationType: 'confirmation',
            title: notification.taskReassigned,
          })
        );
        scrolltoTop();
      })
      .catch(() => {});
  },
  onUnmount: () => {
    dispatch(clearActionErrors());
    dispatch(clearSearch());
  },
  onUserSearch: term => {
    if (term && term.length >= 3) {
      dispatch(search(term));
    } else if (term.length === 0) {
      dispatch(clearSearch());
    }
  },
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
