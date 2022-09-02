import { connect } from 'react-redux';
import path from 'ramda/src/path';

import activityNavigation from '../../util/activityNavigation';
import getHelpers from '../../util/stateHelpers';

import { updateRibbon } from '../../ducks/ribbon';
import { getActivity, getActivityHistory, invalidateActivityDetail } from '../../ducks/activities';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs } = getHelpers(state);

  const {
    activityHistory: { itemHeading: heading, labels, values, attachments: attachmentsHeading },
    arrearsDetails: { heading: arrearsDetailsHeading },
    genericErrorText,
    paymentPlan: { installmentArrangementFormat },
  } = state.dictionary;

  const referralLabels = path(['dictionary', 'referral'], state);
  const pauseLabels = path(['dictionary', 'pause'], state);
  const paymentLabels = path(['dictionary', 'payment', 'labels'], state);
  const paymentPlanLabels = path(['dictionary', 'paymentPlan', 'labels'], state);
  const legalReferralLabels = path(['dictionary', 'legalReferral'], state);

  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const itemId = path(['match', 'params', 'itemId'], ownProps);
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);
  const goToHistoryItem = historyId =>
    ownProps.history.push(`/arrears-details/${arrearsId}/history/${historyId}`);
  const activities = get(['activities', 'history'], []);
  const attachments = get(['activities', 'attachments']);
  const attachmentsLoading = get(['activities', 'attachmentsLoading'], []);
  const attachmentsError = get(['activities', 'attachmentsError'], []);
  const activityHistoryNavigation = activityNavigation(activities, itemId);

  return {
    activities,
    activityHistoryNavigation,
    genericErrorText,
    attachmentsHeading,
    activityDetail: get(['activities', 'detail']),
    activityError: get(['activities', 'error']),
    activityLoading: get(['activities', 'loading']),
    arrearsId,
    breadcrumb: getBreadcrumbs(
      heading,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    canGoNext: !activityHistoryNavigation.isLast(),
    canGoPrevious: !activityHistoryNavigation.isFirst(),
    heading,
    goToHistoryItem,
    itemId,
    labels,
    redirectToDetailsPage,
    values,
    referralLabels,
    pauseLabels,
    paymentLabels,
    paymentPlanLabels: { installmentArrangementFormat, ...paymentPlanLabels },
    legalReferralLabels,
    attachments,
    attachmentsError,
    attachmentsLoading,
  };
};

export const mergeProps = (
  {
    activities,
    activityDetail,
    activityHistoryNavigation,
    arrearsId,
    breadcrumb,
    heading,
    goToHistoryItem,
    itemId,
    redirectToDetailsPage,
    ...stateProps
  },
  { dispatch },
  ownProps
) => ({
  ...stateProps,
  activities,
  itemId,
  activityDetail,
  getActivityById: id => {
    const activityHistoryItem = activities.find(activity => activity.id === id);
    dispatch(getActivity(activityHistoryItem)).catch(() => {});
  },
  getActivityHistory: () => {
    dispatch(getActivityHistory(arrearsId));
  },
  invalidateActivityDetail: () => dispatch(invalidateActivityDetail()),
  onBack: () => redirectToDetailsPage(),
  onNext: () => {
    const nextHistoryId = activityHistoryNavigation.getNextHistoryId();
    if (nextHistoryId) {
      goToHistoryItem(nextHistoryId);
    }
  },
  onPrevious: () => {
    const prevHistoryId = activityHistoryNavigation.getPreviousHistoryId();
    if (prevHistoryId) {
      goToHistoryItem(prevHistoryId);
    }
  },
  updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
