import { mergeProps, mapStateToProps } from './connect';
import * as arrearsActions from '../../ducks/arrears';
import state from '../../../__mocks__/state';

describe('PatchStatistics connector', () => {
  let dispatchProps;
  let mockState;
  let mapStateToPropsResult;

  beforeEach(() => {
    mockState = state();
  });

  describe('mapStateToProps', () => {
    beforeEach(() => {
      mapStateToPropsResult = mapStateToProps(mockState);
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
        arrearsActions.getArrearsStatistics = jest.fn();
        result = mergeProps({ ...mapStateToPropsResult }, dispatchProps);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('generates the correct props', () => {
        expect(result).toMatchSnapshot();
      });

      it('performs the correct actions for getArrearsStatistics', () => {
        const patch = 'providedPatch';
        result.getArrearsStatistics(patch);
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(arrearsActions.getArrearsStatistics).toHaveBeenCalledWith(patch);
      });
    });
  });
});
