import * as ribbonActions from '../../ducks/ribbon';
import * as activityActions from '../../ducks/activities';

import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('ActivityHistoryItem connector', () => {
  let mockState;
  let mapStateToPropsResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      bar: 'baz',
      history: {
        push: jest.fn(),
      },
      match: {
        params: {
          arrearsId: 'ABC123',
          itemId: 'DEF456',
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
          catch: () => {},
          then: cb => {
            cb();
            return { catch: () => {} };
          },
        })),
      };
      ribbonActions.updateRibbon = jest.fn();
      activityActions.getActivity = jest.fn();
      activityActions.getActivityHistory = jest.fn();
      activityActions.invalidateActivityDetail = jest.fn();
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

    it('performs the correct actions for onBack', () => {
      result.onBack();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions when updatePageHeader fires', () => {
      result.updatePageHeader();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(ribbonActions.updateRibbon).toHaveBeenCalledWith({
        title: mapStateToPropsResult.heading,
        breadcrumb: mapStateToPropsResult.breadcrumb,
      });
    });

    it('performs the correct actions when getActivityById is populated', () => {
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
      const targetId = 'DEF456';
      result.getActivityById(targetId);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(activityActions.getActivity).toHaveBeenCalled();
      expect(activityActions.getActivity.mock.calls[0][0]).toMatchObject(
        mockState.activities.history.filter(d => d.id === targetId)[0]
      );
    });

    it('performs the correct actions when getActivityHistory is populated', () => {
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
      result.getActivityHistory();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(activityActions.getActivityHistory).toHaveBeenCalledWith(
        ownProps.match.params.arrearsId
      );
    });

    it('calls correctly invalidateActivityDetail', () => {
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
      result.invalidateActivityDetail();
      expect(activityActions.invalidateActivityDetail).toHaveBeenCalled();
    });

    it('performs a redirect when onNext is called', () => {
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
      result.onNext();
      expect(ownProps.history.push).toHaveBeenCalled();
    });

    it('performs a redirect when onPrevious is called', () => {
      ownProps = {
        ...ownProps,
        match: {
          params: {
            itemId: 'UE21sa',
          },
        },
      };
      mapStateToPropsResult = mapStateToProps(mockState, ownProps);
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
      result.onPrevious();
      expect(ownProps.history.push).toHaveBeenCalled();
    });
  });
});
