import { connect } from 'react-redux';
import path from 'ramda/src/path';
import uuidv4 from 'uuid/v4';

import getHelpers from '../../util/stateHelpers';
import { updateRibbon } from '../../ducks/ribbon';
import {
  clearSubmissions,
  createSubmission,
  generateNewSubmissionId,
  setFormRendered,
} from '../../ducks/forms';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs } = getHelpers(state);
  const {
    arrearsDetails: { heading: arrearsDetailsHeading },
    legalCaseReferral: { buttonLabels, formError, legalCaseReferral },
  } = state.dictionary;

  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const arrears = get(['arrears', 'items']);
  const currentArrear = arrears.find(arrear => arrear.id === arrearsId) || {};
  const newLegalReferralId = uuidv4();

  const redirectToReviewPage = () =>
    ownProps.history.push(
      `/arrears-details/${arrearsId}/legal-case-referral/${newLegalReferralId}/review`
    );
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);
  const unsplitName = path(['legalReferralCase', 'formName'], currentArrear);
  const lastSubmissionId = path(['legalReferralCase', 'lastSubmissionId'], currentArrear);

  const referralFormName = unsplitName && unsplitName.split('|')[1].trim();
  return {
    arrearsId,
    breadcrumb: getBreadcrumbs(
      legalCaseReferral,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    error: get(['forms', 'error']),
    formError,
    formRendered: get(['forms', 'formRendered']),
    heading: legalCaseReferral,
    loading: get(['forms', 'loading']),
    newLegalReferralId,
    redirectToDetailsPage,
    redirectToReviewPage,
    referralFormName,
    submissionId: get(['forms', referralFormName, 'submissions', 0]),
    systemUserId: get(['user', 'profile', 'id']),
    lastSubmissionId,
    formProps: {
      buttonLabels,
    },
  };
};

export const mergeProps = (
  {
    arrearsId,
    breadcrumb,
    formProps,
    heading,
    redirectToDetailsPage,
    redirectToReviewPage,
    referralFormName,
    ...stateProps
  },
  { dispatch },
  ownProps
) => ({
  arrearsId,
  ...stateProps,
  clearSubmissions: () => dispatch(clearSubmissions(referralFormName)),
  createSubmission: () => dispatch(createSubmission(referralFormName, arrearsId)),
  generateNewSubmissionId: () => dispatch(generateNewSubmissionId(referralFormName, arrearsId)),
  formProps: {
    ...formProps,
    onSuccessfulSubmit: submissionId => redirectToReviewPage(submissionId),
    onCancel: () => redirectToDetailsPage(),
  },
  referralFormName,
  setFormRendered: () => dispatch(setFormRendered()),
  updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
