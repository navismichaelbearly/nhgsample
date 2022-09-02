import React from 'react';
import { mergeProps, mapStateToProps } from './connect';
import * as paymentPlanActions from '../../ducks/paymentPlan';
import * as modalActions from '../../ducks/modal';
import state from '../../../__mocks__/state';

jest.mock('../ClosePaymentPlan/', () => () => <div>ClosePaymentPlan Modal</div>);

describe('ViewPaymentPlan connector', () => {
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
          arrearsId: '123',
          paymentPlanId: '456',
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
        modalActions.setModalContent = jest.fn();
        paymentPlanActions.createPlan = jest.fn();
        paymentPlanActions.clearPlanError = jest.fn();
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

      it('should redirect back to details page', () => {
        result.onBack();
        expect(redirectToDetailsPage).toHaveBeenCalled();
      });

      it('should perform the correct action when clearError is called', () => {
        result.clearError();
        expect(paymentPlanActions.clearPlanError).toHaveBeenCalled();
      });

      it('performs the correct actions for onClose', () => {
        result.onClose();
        expect(modalActions.setModalContent).toHaveBeenCalled();
        expect(modalActions.setModalContent.mock.calls).toMatchSnapshot();
      });
    });
  });
});
