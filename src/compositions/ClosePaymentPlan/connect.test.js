import { mergeProps, mapStateToProps } from './connect';
import * as notificationActions from '../../ducks/notifications';
import * as paymentPlanActions from '../../ducks/paymentPlan';
import * as modalActions from '../../ducks/modal';
import state from '../../../__mocks__/state';

describe('ClosePaymentPlan connector', () => {
  let dispatchProps;
  let mockState;
  let mapStateToPropsResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      arrearsId: 'providedArrearsId',
      paymentPlanId: 'providedPaymentPlanId',
      redirectToDetailsPage: jest.fn(),
    };
  });

  describe('mapStateToProps', () => {
    beforeEach(() => {
      mapStateToPropsResult = mapStateToProps(mockState, ownProps);
    });
    it('generates the correct props', () => {
      expect(mapStateToPropsResult).toMatchSnapshot();
    });

    describe('mergeProps', () => {
      let result;
      let redirectToDetailsPage;
      beforeEach(() => {
        dispatchProps = {
          dispatch: jest.fn(() => ({
            then: cb => {
              cb();
              return {
                then: cb2 => {
                  cb2();
                  return {
                    catch: () => {},
                  };
                },
              };
            },
          })),
        };
        modalActions.setModalContent = jest.fn();
        paymentPlanActions.closePlan = jest.fn();
        notificationActions.addNotification = jest.fn();
        redirectToDetailsPage = jest.fn();
        result = mergeProps(
          { ...mapStateToPropsResult, redirectToDetailsPage },
          dispatchProps,
          ownProps
        );
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('generates the correct props', () => {
        expect(result).toMatchSnapshot();
      });

      it('performs the correct actions when onBack fires', () => {
        result.onCancel();
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(modalActions.setModalContent).toHaveBeenCalledWith();
      });

      it('performs the correct actions for onClose', () => {
        const payload = {
          a: 'b',
        };
        result.onClose(payload);
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(paymentPlanActions.closePlan).toHaveBeenCalledWith(
          ownProps.arrearsId,
          ownProps.paymentPlanId,
          payload
        );

        expect(ownProps.redirectToDetailsPage).toHaveBeenCalled();
        expect(notificationActions.addNotification).toHaveBeenCalled();
        expect(notificationActions.addNotification.mock.calls[0][0]).toMatchSnapshot();
      });
    });
  });
});
