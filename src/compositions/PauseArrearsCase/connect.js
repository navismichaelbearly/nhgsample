import { connect } from 'react-redux';
import path from 'ramda/src/path';
import { formatting } from 'nhh-styles';
import format from 'string-format';

import { addNotification } from '../../ducks/notifications';
import {
  cancelPause,
  clearPauseError,
  getPause,
  createPause,
  getPauseRules,
  invalidateActivePause,
  patchPause,
  declinePause,
} from '../../ducks/pause';
import { updateRibbon } from '../../ducks/ribbon';
import {
  DRAFT,
  COMPLETEDSTATUSCODE,
  CANCELLEDSTATUSCODE,
  UPDATESTATUSCODE,
} from '../../constants/pause';
import getHelpers from '../../util/stateHelpers';
import { isUserSeniorManager } from '../../util/userRoles';
import pausePatchPayload from '../../util/pausePatchPayload';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs, getString } = getHelpers(state);
  const {
    arrearsDetails: { heading: arrearsDetailsHeading },
    pauseArrearsCase: { errorText, labels, notification, pauseArrearsCase },
  } = state.dictionary;
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const pauseId = path(['match', 'params', 'pauseId'], ownProps);
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);
  const cancelPauseRequestLabel = getString(['pauseArrearsCase', 'cancelPauseRequest']);
  const declinePauseRequestLabel = getString(['pauseArrearsCase', 'declinePauseRequest']);
  const currentUser = get(['user', 'profile', 'fullname']);
  const cancelPauseRequestMessage = format(cancelPauseRequestLabel, { username: currentUser });
  const declinePauseRequestMessage = format(declinePauseRequestLabel, { username: currentUser });
  const userRoles = get(['user', 'roles']);

  return {
    activePause: get(['pause', 'activePause']),
    pauseStatus: get(['pause', 'activePause', 'status']),
    arrearsId,
    breadcrumb: getBreadcrumbs(
      pauseArrearsCase,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    errorText,
    formError: get(['pause', 'error']),
    heading: pauseArrearsCase,
    labels,
    loading: get(['pause', 'loading']),
    notification,
    pauseId,
    redirectToDetailsPage,
    rules: get(['pause', 'pauseRules']),
    userId: get(['user', 'profile', 'id']),
    roles: {
      isSeniorManager: isUserSeniorManager(userRoles),
    },
    cancelPauseRequestMessage,
    declinePauseRequestMessage,
  };
};

export const mergeProps = (
  {
    arrearsId,
    breadcrumb,
    heading,
    notification,
    pauseId,
    redirectToDetailsPage,
    rules,
    userId,
    pauseStatus,
    cancelPauseRequestMessage,
    declinePauseRequestMessage,
    ...stateProps
  },
  { dispatch },
  ownProps
) => {
  const success = (title, lines, dataBddPrefix) => {
    redirectToDetailsPage();
    dispatch(
      addNotification({
        dataBddPrefix,
        lines,
        icon: 'success',
        notificationType: 'confirmation',
        title,
      })
    );
  };

  const getNotificationTitle = (isPatch, { requireManagerApproval }) => {
    const updateTitle = `updateTitle${requireManagerApproval ? 'Approve' : ''}`;
    const createTitle = `createTitle${requireManagerApproval ? 'Approve' : ''}`;
    return notification[isPatch ? updateTitle : createTitle];
  };

  return {
    ...stateProps,
    clearError: () => dispatch(clearPauseError()),
    rules,
    getPause: () => {
      dispatch(invalidateActivePause());
      if (pauseId) {
        dispatch(getPause(arrearsId, pauseId)).then(() =>
          dispatch(getPauseRules(arrearsId, userId))
        );
      } else {
        dispatch(getPauseRules(arrearsId, userId));
      }
    },
    onBack: () => redirectToDetailsPage(),
    onCancel: () =>
      dispatch(
        pauseStatus === DRAFT
          ? declinePause(
              arrearsId,
              pauseId,
              pausePatchPayload(CANCELLEDSTATUSCODE, declinePauseRequestMessage)
            )
          : cancelPause(
              arrearsId,
              pauseId,
              pausePatchPayload(COMPLETEDSTATUSCODE, cancelPauseRequestMessage)
            )
      )
        .then(() => success(notification.cancelTitle, [], 'cancelPauseArrearsCase'))
        .catch(() => {}),
    onSubmit: (payload, isPatch) => {
      dispatch(
        isPatch
          ? patchPause(arrearsId, pauseId, pausePatchPayload(UPDATESTATUSCODE, '', payload))
          : createPause(arrearsId, payload)
      )
        .then(() => {
          const line1 = payload.requireManagerApproval
            ? [{ text: notification.requiresApproval }]
            : [];
          const notificationLines = [
            ...line1,
            {
              dataBdd: 'pauseReason',
              text: format(notification.pauseDetails, {
                reason: (rules.find(rule => rule.id === payload.reasonId) || {}).title,
                date: formatting.formatDate(payload.endDate),
              }),
            },
            { text: notification.fullDetails },
          ];
          success(getNotificationTitle(isPatch, payload), notificationLines, 'pauseArrearsCase');
        })
        .catch(() => {});
    },
    updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
    ...ownProps,
  };
};

export default connect(mapStateToProps, null, mergeProps);
