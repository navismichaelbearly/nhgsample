import * as actions from '../../ducks/ribbon';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('ArchivedTasks connector', () => {
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
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      mapStateToPropsResult = mapStateToProps(mockState, ownProps);
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let result;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(),
      };
      actions.updateRibbon = jest.fn();
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
        breadcrumb: [
          {
            href: '#{Dashboards.Core.CustomerBaseURL}',
            id: 'breadcrumb-dashboard',
            label: 'Dashboard',
          },
          { id: 'breadcrumb-arrearsDashboard', label: 'My arrears', to: '/' },
          { label: 'Arrears details', to: '/arrears-details/foo' },
          { id: 'breadcrumb-Closed and cancelled tasks', label: 'Closed and cancelled tasks' },
        ],
        title: 'Closed and cancelled tasks',
      });
    });
  });
});
