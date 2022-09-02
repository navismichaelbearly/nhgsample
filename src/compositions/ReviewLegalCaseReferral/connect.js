import { connect } from 'react-redux';
import path from 'ramda/src/path';
import pathOr from 'ramda/src/pathOr';

import getHelpers from '../../util/stateHelpers';
import { updateRibbon } from '../../ducks/ribbon';
import {
  cancelLegalReferral,
  getLegalReferral,
  setLegalReferralSubmitted,
  clear as clearState,
} from '../../ducks/legalReferral';
import { addNotification } from '../../ducks/notifications';
import downloadFile from '../../util/downloadFile';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs } = getHelpers(state);
  const {
    arrearsDetails: { heading: arrearsDetailsHeading },
    legalCaseReferral: { formError, legalCaseReferral, reviewReferral },
  } = state.dictionary;

  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const submissionId = path(['match', 'params', 'submissionId'], ownProps);
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);

  const arrearsItems = get(['arrears', 'items']);
  const arrearsDetail = arrearsItems.find(i => i.id === arrearsId);
  const requiresApproval = pathOr(true, ['legalReferralCase', 'requiresApproval'], arrearsDetail);
  const notificationSubmittedText = requiresApproval
    ? reviewReferral.notification.submittedText
    : reviewReferral.notification.submittedNonApprovalText;

  return {
    breadcrumb: getBreadcrumbs(
      legalCaseReferral,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    errorStatus: get(['legalReferral', 'errorStatus']),
    formError,
    heading: legalCaseReferral,
    loading: get(['legalReferral', 'loading']),
    notification: reviewReferral.notification,
    notificationSubmittedText,
    redirectToDetailsPage,
    referralPack: get(['legalReferral', 'detail', 'referralPack']),
    requiresApproval,
    submissionId,
    text: { ...reviewReferral },
  };
};

export const mergeProps = (
  {
    breadcrumb,
    heading,
    notification,
    notificationSubmittedText,
    redirectToDetailsPage,
    submissionId,
    ...stateProps
  },
  { dispatch },
  ownProps
) => {
  const dispatchNotification = (dataBddPrefix, title, lines) => {
    dispatch(
      addNotification({
        dataBddPrefix,
        icon: 'success',
        lines,
        notificationType: 'confirmation',
        title,
      })
    );
    redirectToDetailsPage();
  };

  return {
    ...stateProps,
    onSubmit: () =>
      dispatch(setLegalReferralSubmitted(submissionId))
        .then(() => dispatchNotification('submitLegalCaseReferral', notificationSubmittedText))
        .catch(() => {}),
    onCancel: payload =>
      dispatch(cancelLegalReferral(submissionId, payload))
        .then(() =>
          dispatchNotification('cancelLegalCaseReferral', notification.cancelledText, [
            { text: notification.cancelledLine1 },
          ])
        )
        .catch(() => {}),
    updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
    getLegalReferral: () => dispatch(getLegalReferral(submissionId)),
    downloadFile: (uri, filename) => downloadFile(uri, filename),
    invalidateLegalReferralState: () => dispatch(clearState()),
    ...ownProps,
  };
};

export default connect(mapStateToProps, null, mergeProps);
