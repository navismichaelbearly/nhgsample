import * as actions from '../../ducks/activities';

import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('ActivityHistory connector', () => {
  let mockState;
  let mapStateToPropsResult;

  beforeEach(() => {
    mockState = state();
    mapStateToPropsResult = mapStateToProps(mockState);
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let ownProps;
    let result;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(() => ({ then: cb => cb })),
      };
      ownProps = {
        bar: 'baz',
        match: {
          params: {
            arrearsId: 'ABC123',
          },
        },
      };
      actions.getActivityHistory = jest.fn();
      actions.invalidateActivityHistory = jest.fn();
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });

    it('performs the correct actions when getActivityHistory fires', () => {
      result.getActivityHistory();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(actions.getActivityHistory).toHaveBeenCalledWith('ABC123');
    });

    it('performs the correct action when invalidate fires', () => {
      result.invalidateActivityHistory();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
    });
  });
});
