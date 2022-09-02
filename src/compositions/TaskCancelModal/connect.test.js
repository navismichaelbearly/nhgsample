import { mergeProps, mapStateToProps } from './connect';
import * as modalActions from '../../ducks/modal';
import * as notificationActions from '../../ducks/notifications';
import * as taskActions from '../../ducks/tasks';
import state from '../../../__mocks__/state';

import scrolltoTop from '../../util/scrolltoTop';

jest.mock('../../util/scrolltoTop', () => jest.fn());

describe('TaskCloseModal connector', () => {
  let dispatchProps;
  let mockState;
  let mapStateToPropsResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      arrearsId: 'arrearsId',
      task: {
        id: 'foo',
        type: 'manual',
        status: 'Open',
        title: 'this is a title',
        dueDate: '2018-08-27T15:08:44+00:00',
        owner: {
          id: '9e0dca1e-0538-e811-80c9-005056825b41',
          name: 'DynamicsAATest Test',
          type: 'systemusers',
        },
        raisedBy: {
          name: 'Frank',
        },
        createdOn: '2018-08-20T15:08:44+00:00',
        regardingObjectModel: { id: 'bar', type: 'Arrears' },
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
      beforeEach(() => {
        dispatchProps = {
          dispatch: jest.fn(() => ({
            catch: () => {},
            then: cb => {
              cb();
              return { catch: () => {} };
            },
          })),
        };
        modalActions.setModalContent = jest.fn();
        notificationActions.addNotification = jest.fn();
        taskActions.cancelTask = jest.fn();
        taskActions.clearActionErrors = jest.fn();
        taskActions.getTasks = jest.fn();
        result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('generates the correct props', () => {
        expect(result).toMatchSnapshot();
      });

      it('performs the correct action when onBack fires', () => {
        result.onCancel();
        expect(modalActions.setModalContent).toHaveBeenCalled();
      });

      it('performs the correct action when onUnmount fires', () => {
        result.onUnmount();
        expect(taskActions.clearActionErrors).toHaveBeenCalled();
      });

      it('performs the correct actions for onSubmit', () => {
        const payload = {
          reason: 'some reason',
        };

        result.onSubmit(payload);
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(taskActions.cancelTask).toHaveBeenCalledWith(ownProps.task.id, {
          ...payload,
          status: 'Canceled',
        });
        expect(modalActions.setModalContent).toHaveBeenCalled();
        expect(taskActions.getTasks).toHaveBeenCalled();
        expect(taskActions.getTasks.mock.calls[0][0]).toMatchSnapshot();
        expect(notificationActions.addNotification).toHaveBeenCalled();
        expect(notificationActions.addNotification.mock.calls[0][0]).toMatchSnapshot();
        expect(scrolltoTop).toHaveBeenCalled();
      });
    });
  });
});
