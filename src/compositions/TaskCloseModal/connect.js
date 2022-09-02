import { connect } from 'react-redux';
import { formatting } from 'nhh-styles';
import pickAll from 'ramda/src/pickAll';
import { isUserSeniorManager } from '../../util/userRoles';
import getHelpers from '../../util/stateHelpers';

import { setModalContent } from '../../ducks/modal';
import { addNotification } from '../../ducks/notifications';
import { clearActionErrors, getTasks, closeTask } from '../../ducks/tasks';
import scrolltoTop from '../../util/scrolltoTop';
import { COMPLETED } from '../../constants/taskStatuses';

export const mapStateToProps = state => {
  const { get } = getHelpers(state);
  const {
    taskActionModal: { errorText, labels, notification, taskComplete },
  } = state.dictionary;
  const modalActionError = get(['tasks', 'modalActionError']);
  const isLoading = get(['tasks', 'loading']);

  return {
    errorText,
    labels,
    serverError: modalActionError ? errorText.formError : '',
    notification,
    taskComplete,
    isLoading,
    user: pickAll(['roles'], get(['user'])),
  };
};

export const mergeProps = (
  { notification, user, ...stateProps },
  { dispatch },
  { arrearsId, task, ...ownProps }
) => ({
  ...stateProps,
  onCancel: () => {
    dispatch(setModalContent());
  },
  onSubmit: payload => {
    const { id, title, dueDate } = task;
    const params = { ...payload, status: COMPLETED };
    dispatch(closeTask(id, params))
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
            dataBddPrefix: 'closeTask',
            lines: [{ text: `${title} ${formatting.formatDate(dueDate)}` }],
            icon: 'success',
            notificationType: 'confirmation',
            title: notification.taskComplete,
          })
        );
        scrolltoTop();
      })
      .catch(() => {});
  },
  onUnmount: () => {
    dispatch(clearActionErrors());
  },
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
