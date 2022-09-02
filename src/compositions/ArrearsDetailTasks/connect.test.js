import * as modalActions from '../../ducks/modal';
import * as tasksActions from '../../ducks/tasks';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';
import { OPEN, CANCELLED, COMPLETED } from '../../constants/taskStatuses';
import * as userRoles from '../../util/userRoles';

jest.mock('../../util/userRoles', () => ({
  isUserSeniorManager: jest.fn(),
}));

describe('ArrearsDashboard connector', () => {
  let mockState;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    modalActions.setModalContent = jest.fn();
    tasksActions.getTasks = jest.fn();
    tasksActions.invalidateTasks = jest.fn();
    ownProps = {
      match: {
        params: {
          arrearsId: 'foo',
        },
      },
      bar: 'baz',
    };
    userRoles.isUserSeniorManager.mockReturnValue(false);
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      expect(mapStateToProps(mockState, ownProps)).toMatchSnapshot();
    });
    it('generates the correct props when canCreateLegalReferral is true', () => {
      mockState.arrears.items[0].legalReferralCase.canCreateLegalReferral = true;
      expect(mapStateToProps(mockState, ownProps)).toMatchSnapshot();
    });
    it('generates canCreateLegalReferral=false when user is SeniorManager', () => {
      mockState.arrears.items[0].legalReferralCase.canCreateLegalReferral = true;
      userRoles.isUserSeniorManager.mockReturnValue(true);
      expect(mapStateToProps(mockState, ownProps)).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let result;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(),
      };
      const mapStateToPropsResult = mapStateToProps(mockState, ownProps);
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });

    it('performs the correct action when invalidate fires', () => {
      result.invalidateTasks();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
    });

    describe('openTaskModal', () => {
      it('performs the correct actions when openTaskModal fires', () => {
        const modalContent = 'template content';
        result.openTaskModal(modalContent);
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(modalActions.setModalContent).toHaveBeenCalledWith(modalContent);
      });
    });

    it('performs the correct actions when getArrearTasks fires for Open Tasks', () => {
      result.getArrearTasks(false, { rock: 'roll' });
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(tasksActions.getTasks).toHaveBeenCalledWith({
        EntityId: 'foo',
        EntityType: 'Arrears',
        Statuses: OPEN,
        skipFetchRoles: false,
        rock: 'roll',
      });
      expect(userRoles.isUserSeniorManager).toHaveBeenCalledWith([]);
    });

    it('performs the correct actions when getArrearTasks fires for Archived Tasks', () => {
      result.getArrearTasks(true, { rock: 'roll' });
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(tasksActions.getTasks).toHaveBeenCalledWith({
        EntityId: 'foo',
        EntityType: 'Arrears',
        Statuses: `${CANCELLED},${COMPLETED}`,
        skipFetchRoles: false,
        rock: 'roll',
      });
      expect(userRoles.isUserSeniorManager).toHaveBeenCalledWith([]);
    });
  });
});
