import React from 'react';
import { formatting } from 'nhh-styles';
import { connect } from 'react-redux';
import path from 'ramda/src/path';
import ClosePaymentPlan from '../ClosePaymentPlan';
import { clearPlanError, getPlan } from '../../ducks/paymentPlan';
import { updateRibbon } from '../../ducks/ribbon';
import { setModalContent } from '../../ducks/modal';
import getHelpers from '../../util/stateHelpers';
import { installmentArrangement } from '../../util/paymentPlan';

export const mapStateToProps = (state, ownProps) => {
  const { get, getString, getBreadcrumbs } = getHelpers(state);
  const {
    arrearsDetails: { heading: arrearsDetailsHeading },
    paymentPlan: { installmentArrangementFormat, labels, viewPaymentPlan },
  } = state.dictionary;
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const paymentPlanId = path(['match', 'params', 'paymentPlanId'], ownProps);
  const paymentPlan = get(['paymentPlan', 'plan']);
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);

  return {
    arrearsId,
    breadcrumb: getBreadcrumbs(
      viewPaymentPlan,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    error: get(['paymentPlan', 'error']),
    errorText: getString(['paymentPlan', 'errorText']),
    labels,
    loading: get(['paymentPlan', 'loading']),
    paymentPlan: {
      description: paymentPlan.description,
      raisedBy: path(['raisedBy', 'name'], paymentPlan),
      startDate: formatting.formatDate(paymentPlan.startDate),
      endDate: formatting.formatDate(paymentPlan.endDate),
      type: paymentPlan.type,
      installment: installmentArrangement(
        installmentArrangementFormat,
        path(['installment', 'amount'], paymentPlan),
        path(['installment', 'period'], paymentPlan),
        formatting.formatDate(paymentPlan.startDate),
        path(['installment', 'schedule'], paymentPlan)
      ),
    },
    paymentPlanId,
    redirectToDetailsPage,
    viewPaymentPlan,
  };
};

export const mergeProps = (
  { arrearsId, breadcrumb, heading, paymentPlanId, redirectToDetailsPage, ...stateProps },
  { dispatch },
  ownProps
) => ({
  ...stateProps,
  clearError: () => dispatch(clearPlanError()),
  getPaymentPlan: () => {
    dispatch(getPlan(arrearsId, paymentPlanId)).catch(() => {});
  },
  onBack: () => redirectToDetailsPage(),
  onClose: () =>
    dispatch(
      setModalContent(
        <ClosePaymentPlan
          arrearsId={arrearsId}
          paymentPlanId={paymentPlanId}
          redirectToDetailsPage={redirectToDetailsPage}
        />
      )
    ),
  updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
