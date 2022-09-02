import * as actions from '../../ducks/ribbon';
import * as pauseActions from '../../ducks/pause';
import * as notificationActions from '../../ducks/notifications';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('PauseArrearsCase connector', () => {
  let mockState;
  let mapStateToPropsResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      bar: 'baz',
      match: {
        params: {
          arrearsId: 'foo',
        },
      },
    };
    mapStateToPropsResult = mapStateToProps(mockState, ownProps);
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
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
      actions.updateRibbon = jest.fn();
      pauseActions.approvePause = jest.fn();
      pauseActions.getPause = jest.fn();
      pauseActions.getPauseRules = jest.fn();
      notificationActions.addNotification = jest.fn();
      redirectToDetailsPage = jest.fn();
      result = mergeProps(
        { ...mapStateToPropsResult, redirectToDetailsPage, pauseId: 'abc123' },
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

    it('performs the correct actions for updatePageHeader', () => {
      result.updatePageHeader();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(actions.updateRibbon).toHaveBeenCalled();
    });

    it('performs the correct actions for getPause', () => {
      result.getPause();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(pauseActions.getPause).toHaveBeenCalledWith(mapStateToPropsResult.arrearsId, 'abc123');
      expect(pauseActions.getPauseRules).toHaveBeenCalledWith(
        mapStateToPropsResult.arrearsId,
        mapStateToPropsResult.userId
      );
    });

    it('performs the correct actions for onBack', () => {
      result.onBack();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for onSubmit for deny', () => {
      result.onSubmit('Nu uh');
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(pauseActions.approvePause).toHaveBeenCalledWith(
        mapStateToPropsResult.arrearsId,
        'abc123',
        'Nu uh'
      );

      const addNotification = notificationActions.addNotification.mock.calls[0][0];
      expect(notificationActions.addNotification).toHaveBeenCalled();
      expect(addNotification).toMatchSnapshot();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for onSubmit for approve', () => {
      result.onSubmit();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(pauseActions.approvePause).toHaveBeenCalledWith(
        mapStateToPropsResult.arrearsId,
        'abc123',
        undefined
      );

      const addNotification = notificationActions.addNotification.mock.calls[0][0];
      expect(notificationActions.addNotification).toHaveBeenCalled();
      expect(addNotification).toMatchSnapshot();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });
  });
});
