import * as actions from '../../ducks/ribbon';
import * as pauseActions from '../../ducks/pause';
import * as notificationActions from '../../ducks/notifications';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('PauseArrearsCase connector', () => {
  let mockState;
  let mapStateToPropsResult;
  let ownProps;
  let reasonData;

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
    reasonData = {
      reasonId: 'abc123',
      endDate: '2019-06-27T13:56:50.951Z',
      description: 'Some details',
      notifyManager: true,
      requireManagerApproval: false,
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
      pauseActions.cancelPause = jest.fn();
      pauseActions.declinePause = jest.fn();
      pauseActions.getPause = jest.fn();
      pauseActions.getPauseRules = jest.fn();
      pauseActions.createPause = jest.fn();
      pauseActions.patchPause = jest.fn();
      pauseActions.invalidateActivePause = jest.fn();
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

    it('performs the correct actions for updatePageHeader', () => {
      result.updatePageHeader();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(actions.updateRibbon).toHaveBeenCalled();
    });

    it('performs the correct actions for getPause when there is no pauseId', () => {
      result.getPause();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(pauseActions.invalidateActivePause).toHaveBeenCalled();
      expect(pauseActions.getPauseRules).toHaveBeenCalledWith(
        mapStateToPropsResult.arrearsId,
        mapStateToPropsResult.userId
      );
    });

    it('performs the correct actions for getPause when there is a pauseId', () => {
      result = mergeProps(
        { ...mapStateToPropsResult, redirectToDetailsPage, pauseId: 'abc123' },
        dispatchProps,
        ownProps
      );
      result.getPause();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(pauseActions.invalidateActivePause).toHaveBeenCalled();
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

    it('performs the correct actions for onSubmit for create', () => {
      result.onSubmit(reasonData);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(pauseActions.createPause).toHaveBeenCalledWith('foo', reasonData);

      const addNotification = notificationActions.addNotification.mock.calls[0][0];
      expect(notificationActions.addNotification).toHaveBeenCalled();
      expect(addNotification).toMatchSnapshot();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for onSubmit for create with approval required', () => {
      const newReasonData = {
        ...reasonData,
        requireManagerApproval: true,
      };
      result.onSubmit(newReasonData);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(pauseActions.createPause).toHaveBeenCalledWith('foo', newReasonData);

      const addNotification = notificationActions.addNotification.mock.calls[0][0];
      expect(notificationActions.addNotification).toHaveBeenCalled();
      expect(addNotification).toMatchSnapshot();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for onSubmit for patch', () => {
      result = mergeProps(
        { ...mapStateToPropsResult, redirectToDetailsPage, pauseId: 'abc123' },
        dispatchProps,
        ownProps
      );
      result.onSubmit(reasonData, true);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(pauseActions.patchPause).toHaveBeenCalledWith('foo', 'abc123', [
        {
          op: 'replace',
          path: '/statusCode',
          value: 99,
        },
        {
          op: 'replace',
          path: '/description',
          value: reasonData.description,
        },
        {
          op: 'replace',
          path: '/endDate',
          value: reasonData.endDate,
        },
        {
          op: 'replace',
          path: '/reasonId',
          value: reasonData.reasonId,
        },
        {
          op: 'replace',
          path: '/requireManagerApproval',
          value: reasonData.requireManagerApproval,
        },
        {
          op: 'replace',
          path: '/notifyManager',
          value: reasonData.notifyManager,
        },
      ]);

      const addNotification = notificationActions.addNotification.mock.calls[0][0];
      expect(notificationActions.addNotification).toHaveBeenCalled();
      expect(addNotification).toMatchSnapshot();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for onSubmit for patch with approval required', () => {
      result = mergeProps(
        { ...mapStateToPropsResult, redirectToDetailsPage, pauseId: 'abc123' },
        dispatchProps,
        ownProps
      );

      const newReasonData = {
        ...reasonData,
        requireManagerApproval: true,
      };

      result.onSubmit(newReasonData, true);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(pauseActions.patchPause).toHaveBeenCalledWith('foo', 'abc123', [
        {
          op: 'replace',
          path: '/statusCode',
          value: 99,
        },
        {
          op: 'replace',
          path: '/description',
          value: newReasonData.description,
        },
        {
          op: 'replace',
          path: '/endDate',
          value: newReasonData.endDate,
        },
        {
          op: 'replace',
          path: '/reasonId',
          value: newReasonData.reasonId,
        },
        {
          op: 'replace',
          path: '/requireManagerApproval',
          value: newReasonData.requireManagerApproval,
        },
        {
          op: 'replace',
          path: '/notifyManager',
          value: newReasonData.notifyManager,
        },
      ]);

      const addNotification = notificationActions.addNotification.mock.calls[0][0];
      expect(notificationActions.addNotification).toHaveBeenCalled();
      expect(addNotification).toMatchSnapshot();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for onCancel when Active', () => {
      result = mergeProps(
        { ...mapStateToPropsResult, redirectToDetailsPage, pauseId: 'abc123' },
        dispatchProps,
        ownProps
      );
      result.onCancel();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(pauseActions.cancelPause).toHaveBeenCalledWith('foo', 'abc123', [
        {
          path: '/description',
          value: 'Mark Brownie cancelled pause request',
          op: 'replace',
        },
        {
          path: '/statusCode',
          value: 2,
          op: 'replace',
        },
      ]);

      const addNotification = notificationActions.addNotification.mock.calls[0][0];
      expect(notificationActions.addNotification).toHaveBeenCalled();
      expect(addNotification).toMatchSnapshot();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for onCancel when Draft', () => {
      result = mergeProps(
        {
          ...mapStateToPropsResult,
          redirectToDetailsPage,
          pauseId: 'abc123',
          pauseStatus: 'Draft',
        },
        dispatchProps,
        ownProps
      );
      result.onCancel();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(pauseActions.declinePause).toHaveBeenCalledWith('foo', 'abc123', [
        {
          path: '/declineDescription',
          value: 'Mark Brownie declined pause request',
          op: 'replace',
        },
        {
          path: '/statusCode',
          value: 3,
          op: 'replace',
        },
      ]);

      const addNotification = notificationActions.addNotification.mock.calls[0][0];
      expect(notificationActions.addNotification).toHaveBeenCalled();
      expect(addNotification).toMatchSnapshot();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });
  });
});
