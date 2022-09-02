import * as actions from '../../ducks/ribbon';
import * as arrearsActions from '../../ducks/arrears';
import * as tasksActions from '../../ducks/tasks';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('ArrearsDashboard connector', () => {
  let tmpProps;
  let mockState;
  let mapStateToPropsResult;

  beforeEach(() => {
    mockState = state();
    arrearsActions.getStatuses = jest.fn();
    arrearsActions.getArrearsSummary = jest.fn();
    tasksActions.getTasksSummary = jest.fn();
    tasksActions.getStatuses = jest.fn();
    tasksActions.getMyTasksSummary = jest.fn();
    tasksActions.getUserTasksSummary = jest.fn();
    tasksActions.getStatuses = jest.fn();

    tmpProps = {
      breadcrumb: [
        {
          label: 'Dashboard',
          href: '#{Dashboards.Core.CustomerBaseURL}',
          id: 'breadcrumb-dashboard',
        },
        {
          label: 'My arrears',
          to: '/',
          id: 'breadcrumb-arrearsDashboard',
        },
      ],
      heading: 'My arrears',
    };
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      mapStateToPropsResult = mapStateToProps(mockState);
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let ownProps;
    let result;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(),
      };
      ownProps = { bar: 'baz' };
      actions.updateRibbon = jest.fn();
      actions.onOpenPatchSelect = jest.fn();
      actions.invalidateTasks = jest.fn();
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });

    it('performs the correct actions when updatePageHeader fires', () => {
      result.updatePageHeader();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(actions.updateRibbon).toHaveBeenCalledWith({
        title: tmpProps.heading,
        breadcrumb: tmpProps.breadcrumb,
      });
    });

    it('performs the correct action when invalidate fires', () => {
      result.invalidateTasks();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
    });

    it('performs the correct actions when getArrearsSummary fires', () => {
      result.getArrearsSummary();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(arrearsActions.getArrearsSummary).toHaveBeenCalledWith({
        patches: 'PTCPRH01',
      });
    });

    it('performs the correct actions when getTasksSummary fires', () => {
      result.getTasksSummary();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
    });

    it('performs the correct actions when getUserTasksSummary fires', () => {
      result.getUserTasksSummary();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
    });

    it('performs the correct actions when getSummaryTasks fires', () => {
      result.getSummaryTasks();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
    });

    it('performs the correct actions when getSelectedUserTasks fires', () => {
      result.getSelectedUserTasks();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
    });
  });
});
