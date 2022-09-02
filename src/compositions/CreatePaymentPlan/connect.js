import { formatting } from 'nhh-styles';
import { connect } from 'react-redux';
import path from 'ramda/src/path';
import PaymentPlanStatic from '../../constants/paymentPlan';
import { addNotification } from '../../ducks/notifications';
import { createPlan, clearPlanError } from '../../ducks/paymentPlan';
import { updateRibbon } from '../../ducks/ribbon';
import getHelpers from '../../util/stateHelpers';
import { installmentArrangement } from '../../util/paymentPlan';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs, getString } = getHelpers(state);
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const createPaymentPlanHeading = getString(['paymentPlan', 'createPaymentPlan']);
  const arrearsDetailsHeading = getString(['arrearsDetails', 'heading']);
  const returnUrl = `/arrears-details/${arrearsId}`;
  const redirectToDetailsPage = () => ownProps.history.push(returnUrl);
  const redirectToAttachmentsPage = paymentPlanId =>
    ownProps.history.push(
      `${returnUrl}/payment-plan/${paymentPlanId}/attachments?redirectTo=${returnUrl}`
    );

  return {
    arrearsId,
    breadcrumb: getBreadcrumbs(
      createPaymentPlanHeading,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    currencySymbol: getString(['currencySymbol']),
    error: get(['paymentPlan', 'error']),
    errorText: getString(['paymentPlan', 'errorText']),
    isLoading: get(['paymentPlan', 'loading']),
    formError: getString(['paymentPlan', 'errorText', 'formError']),
    createPaymentPlanHeading,
    labels: getString(['paymentPlan', 'labels']),
    notification: getString(['paymentPlan', 'notification']),
    redirectToDetailsPage,
    redirectToAttachmentsPage,
    ...PaymentPlanStatic,
  };
};

export const mergeProps = (
  {
    arrearsId,
    breadcrumb,
    currencySymbol,
    createPaymentPlanHeading,
    notification,
    redirectToAttachmentsPage,
    redirectToDetailsPage,
    ...stateProps
  },
  { dispatch },
  ownProps
) => ({
  ...stateProps,
  clearError: () => dispatch(clearPlanError()),
  currencySymbol,
  onBack: () => redirectToDetailsPage(),
  onSubmit: (payload, wantsToAttachFiles) => {
    dispatch(createPlan(arrearsId, payload))
      .then(paymentPlanId => {
        const notificationLines = [
          {
            dataBdd: 'instalmentAmount',
            text: installmentArrangement(
              notification.createPaymentPlanLine1,
              Number(path(['installment', 'amount'], payload)),
              path(['installment', 'period'], payload),
              formatting.formatDate(payload.startDate),
              path(['installment', 'schedule'], payload)
            ),
          },
          {
            text: notification.createPaymentPlanLine2,
          },
        ];
        dispatch(
          addNotification({
            dataBddPrefix: 'createPaymentPlan',
            lines: notificationLines,
            hideCloseButton: true,
            icon: 'success',
            notificationType: 'confirmation',
            title: notification.createPaymentPlanTitle,
          })
        );

        if (wantsToAttachFiles) {
          redirectToAttachmentsPage(paymentPlanId);
        } else {
          redirectToDetailsPage();
        }
      })
      .catch(() => {});
  },
  updatePageHeader: () => dispatch(updateRibbon({ title: createPaymentPlanHeading, breadcrumb })),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
