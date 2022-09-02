import * as arrearsActions from '../../ducks/arrears';
import * as modalActions from '../../ducks/modal';
import * as notificationActions from '../../ducks/notifications';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('ServeNOSPEarly connector', () => {
  let dispatchProps;
  let ownProps;
  let mockState;
  let mapStateToPropsResult;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      arrearsId: 'arrearsId',
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

      beforeEach(() => {
        dispatchProps = {
          dispatch: jest.fn(() => ({
            then: cb => {
              cb();
              return { catch: () => {} };
            },
          })),
        };
        arrearsActions.clearNOSPError = jest.fn();
        arrearsActions.serveNOSP = jest.fn();
        modalActions.setModalContent = jest.fn();
        notificationActions.addNotification = jest.fn();
        result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('generates the correct props', () => {
        expect(result).toMatchSnapshot();
      });

      it('performs the correct actions when getReferralTeams fires', () => {
        result.onCancel();
        expect(modalActions.setModalContent).toHaveBeenCalled();
        expect(arrearsActions.clearNOSPError).toHaveBeenCalled();
      });

      describe('onSubmit', () => {
        it('performs the correct actions when onSubmit fires', () => {
          result.onSubmit();
          expect(dispatchProps.dispatch).toHaveBeenCalled();
          expect(arrearsActions.serveNOSP).toHaveBeenCalledWith(ownProps.arrearsId);
          expect(notificationActions.addNotification).toHaveBeenCalled();
          expect(notificationActions.addNotification.mock.calls).toMatchSnapshot();
          expect(modalActions.setModalContent).toHaveBeenCalled();
        });
      });
    });
  });
});
