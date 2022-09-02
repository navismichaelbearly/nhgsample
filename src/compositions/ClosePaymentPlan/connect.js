import { connect } from 'react-redux';
import { setModalContent } from '../../ducks/modal';
import { addNotification } from '../../ducks/notifications';
import { closePlan } from '../../ducks/paymentPlan';
import getHelpers from '../../util/stateHelpers';

export const mapStateToProps = state => {
  const { getString, get } = getHelpers(state);
  return {
    heading: getString(['paymentPlan', 'closePaymentPlan']),
    labels: getString(['paymentPlan', 'labels']),
    errorText: getString(['paymentPlan', 'errorText']),
    notification: getString(['paymentPlan', 'notification']),
    isLoading: get(['paymentPlan', 'loading']),
  };
};

export const mergeProps = (
  { notification, ...stateProps },
  { dispatch },
  { arrearsId, paymentPlanId, redirectToDetailsPage, ...ownProps }
) => ({
  ...stateProps,
  onCancel: () => dispatch(setModalContent()),
  onClose: payload => {
    dispatch(setModalContent())
      .then(() => dispatch(closePlan(arrearsId, paymentPlanId, payload)))
      .then(() => {
        redirectToDetailsPage();
        const notificationLines = [
          {
            dataBdd: 'message',
            text: notification.closePaymentPlanLine2,
          },
        ];
        dispatch(
          addNotification({
            dataBddPrefix: 'createPaymentPlan',
            lines: notificationLines,
            hideCloseButton: true,
            icon: 'success',
            notificationType: 'confirmation',
            title: notification.closePaymentPlanTitle,
          })
        );
      })
      .catch(() => {});
  },
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
