import { connect } from 'react-redux';
import path from 'ramda/src/path';
import { formatting } from 'nhh-styles';
import format from 'string-format';

import { addNotification } from '../../ducks/notifications';
import { updateRibbon } from '../../ducks/ribbon';
import { approvePause, getPause, getPauseRules } from '../../ducks/pause';
import getHelpers from '../../util/stateHelpers';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs } = getHelpers(state);
  const {
    approvePause: { errorText, labels, notification, pauseRequest, pauseRequestDetails },
    arrearsDetails: { heading: arrearsDetailsHeading },
  } = state.dictionary;

  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const pauseId = path(['match', 'params', 'pauseId'], ownProps);
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);

  return {
    activePause: get(['pause', 'activePause']),
    arrearsId,
    breadcrumb: getBreadcrumbs(
      pauseRequest,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    errorText,
    formError: get(['pause', 'error']),
    heading: pauseRequestDetails,
    labels,
    loading: get(['pause', 'loading']),
    notification,
    pauseId,
    redirectToDetailsPage,
    rules: get(['pause', 'pauseRules']),
    userId: get(['user', 'profile', 'id']),
  };
};

export const mergeProps = (
  {
    activePause,
    arrearsId,
    breadcrumb,
    heading,
    notification: { approvedTitle, cancelledTitle, line1, line2 },
    pauseId,
    redirectToDetailsPage,
    userId,
    ...stateProps
  },
  { dispatch },
  ownProps
) => ({
  ...stateProps,
  activePause,
  getPause: () =>
    dispatch(getPause(arrearsId, pauseId)).then(() => dispatch(getPauseRules(arrearsId, userId))),
  onBack: () => redirectToDetailsPage(),
  onSubmit: reason =>
    dispatch(approvePause(arrearsId, pauseId, reason))
      .then(() => {
        redirectToDetailsPage();
        dispatch(
          addNotification({
            dataBddPrefix: 'approvePause',
            lines: reason
              ? null
              : [
                  { text: format(line1, { date: formatting.formatDate(activePause.endDate) }) },
                  { text: line2 },
                ],
            icon: 'success',
            notificationType: 'confirmation',
            title: reason ? cancelledTitle : approvedTitle,
          })
        );
      })
      .catch(() => {}),
  updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
