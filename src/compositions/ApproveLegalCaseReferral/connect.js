import { connect } from 'react-redux';
import path from 'ramda/src/path';

import { addNotification } from '../../ducks/notifications';
import { updateRibbon } from '../../ducks/ribbon';
import {
  cancelLegalReferral,
  getLegalReferral,
  setLegalReferralApproved,
} from '../../ducks/legalReferral';
import getHelpers from '../../util/stateHelpers';
import downloadFile from '../../util/downloadFile';
import { isUserSeniorManager } from '../../util/userRoles';
import { status as legalReferralCaseStatus } from '../../constants/legalReferral';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs } = getHelpers(state);
  const {
    arrearsDetails: { heading: arrearsDetailsHeading },
    approvelegalCaseReferral: {
      errorText,
      heading,
      labels,
      notification,
      subtitle,
      requiresNonCreatorApproval,
    },
  } = state.dictionary;

  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const submissionId = path(['match', 'params', 'submissionId'], ownProps);
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);

  const isLegalReferralCreatedByLoggedUser =
    get(['legalReferral', 'detail', 'owner', 'id']) === get(['user', 'profile', 'id']);
  const isLoggedUserManagerOrSeniorManager = get(['user', 'userType']) === 'manager';

  const isLoggedUserSeniorManager = isUserSeniorManager(get(['user', 'roles']));
  const isLegalReferralWaitingForManagerSignOff =
    get(['legalReferral', 'detail', 'progressStatus']) ===
    legalReferralCaseStatus.pendingSubmission;

  const canApproveReferral =
    !isLegalReferralCreatedByLoggedUser &&
    isLoggedUserManagerOrSeniorManager &&
    !(isLegalReferralWaitingForManagerSignOff && isLoggedUserSeniorManager);
  const showReadOnlyView = !canApproveReferral;
  const showReadOnlyViewNotification = showReadOnlyView && isLegalReferralCreatedByLoggedUser;

  return {
    activePause: get(['pause', 'activePause']),
    arrearsId,
    breadcrumb: getBreadcrumbs(
      heading,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    errorText,
    formError: get(['pause', 'error']),
    heading,
    labels,
    loading: get(['legalReferral', 'loading']),
    notification,
    referralPack: get(['legalReferral', 'detail', 'referralPack']),
    submissionId,
    subtitle,
    redirectToDetailsPage,
    requiresNonCreatorApproval,
    showReadOnlyView,
    showReadOnlyViewNotification,
  };
};

export const mergeProps = (
  {
    breadcrumb,
    heading,
    notification: { approvedTitle, cancelledTitle },
    submissionId,
    redirectToDetailsPage,
    ...stateProps
  },
  { dispatch },
  ownProps
) => ({
  ...stateProps,
  getLegalReferral: () => dispatch(getLegalReferral(submissionId)),
  heading,
  onBack: () => redirectToDetailsPage(),
  onSubmit: noteText =>
    dispatch(
      noteText
        ? cancelLegalReferral(submissionId, { noteText })
        : setLegalReferralApproved(submissionId)
    )
      .then(() => {
        redirectToDetailsPage();
        dispatch(
          addNotification({
            dataBddPrefix: 'approveLegalReferral',
            icon: 'success',
            notificationType: 'confirmation',
            title: noteText ? cancelledTitle : approvedTitle,
          })
        );
      })
      .catch(() => {}),
  updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
  downloadFile: (uri, filename) => downloadFile(uri, filename),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
