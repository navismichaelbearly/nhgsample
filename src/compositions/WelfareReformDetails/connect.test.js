import * as welfareReformActions from '../../ducks/welfareReform';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('WelfareReformDetails connector', () => {
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
    let result;
    let ownProps;
    let redirectToDetailsPage;
    let params;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(() => ({ then: cb => cb() })),
      };
      welfareReformActions.getWelfareReform = jest.fn();
      welfareReformActions.patchWelfareReform = jest.fn();
      redirectToDetailsPage = jest.fn();
      params = { '0': 'a', '1': 'b', '2': 'c', '3': '1', '4': '2', '5': '3' };
      result = mergeProps(
        {
          ...mapStateToPropsResult,
          redirectToDetailsPage,
        },
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
    });

    it('performs the correct actions for getWelfare when there is a tenancyId', () => {
      result.getWelfareReformDetails();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(welfareReformActions.getWelfareReform).toHaveBeenCalledWith(
        mapStateToPropsResult.tenancyId
      );
    });

    it('performs the correct actions for onBack', () => {
      result.onBack();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for onSubmit for patch', () => {
      result.onSubmit('abc123', params);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(welfareReformActions.patchWelfareReform).toHaveBeenCalledWith(
        mapStateToPropsResult.tenancyId,
        params
      );
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });
  });
});
