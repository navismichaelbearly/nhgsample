import * as actions from '../../ducks/arrears';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('PageContent connector', () => {
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

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(),
      };
      actions.getArrearsDetail = jest.fn();
      actions.getArrearsSummary = jest.fn();
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });

    describe('getArrearsDetail', () => {
      it('calls getArrearsDetail if there is an Arrears ID present', () => {
        result.getArrearsDetail();
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(actions.getArrearsDetail).toHaveBeenCalledWith('foo');
      });

      it('calls getArrearsSummary if there is no Arrears ID present', () => {
        delete mapStateToPropsResult.arrearsId;
        result = mergeProps(mapStateToPropsResult, dispatchProps);
        result.getArrearsDetail();
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(actions.getArrearsSummary).toHaveBeenCalledWith({ patches: 'PTCPRH01' });
      });
    });
  });
});
