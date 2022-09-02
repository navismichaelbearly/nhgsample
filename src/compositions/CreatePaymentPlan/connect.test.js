import { mergeProps, mapStateToProps } from './connect';
import * as notificationActions from '../../ducks/notifications';
import * as paymentPlanActions from '../../ducks/paymentPlan';
import state from '../../../__mocks__/state';

describe('CreatePaymentPlan connector', () => {
  let dispatchProps;
  let mockState;
  let mapStateToPropsResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      history: {
        push: jest.fn(),
      },
      match: {
        params: {
          arrearsId: 'providedArrearsId',
        },
      },
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
              return { catch: () => {} };
            },
          })),
        };
        paymentPlanActions.createPlan = jest.fn();
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
        result.onBack();
        expect(redirectToDetailsPage).toHaveBeenCalled();
      });

      it('performs the correct actions for onSubmit', () => {
        const payload = {
          description: 'Some description',
          installment: {
            amount: 230,
            period: 1,
            schedule: 'Weekly',
          },
          startDate: new Date(2018, 1, 1),
          type: 'Personal',
        };
        result.onSubmit(payload);
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(paymentPlanActions.createPlan).toHaveBeenCalledWith(
          ownProps.match.params.arrearsId,
          payload
        );

        expect(notificationActions.addNotification).toHaveBeenCalled();
        expect(notificationActions.addNotification.mock.calls[0][0]).toMatchSnapshot();
        expect(redirectToDetailsPage).toHaveBeenCalled();
      });
    });
  });
});
