import * as actions from '../../ducks/ribbon';
import * as legalReferralActions from '../../ducks/legalReferral';
import * as notificationActions from '../../ducks/notifications';

import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

jest.mock('../../util/downloadFile', () => (uri, name) => ({ uri, name }));

describe('ApproveLegalCaseReferral connector', () => {
  let mockState;
  let ownProps;

  beforeEach(() => {
    mockState = {
      ...state(),
      legalReferral: {
        detail: {
          referralPack: {
            randomReferralPackProp: 'randomReferralPackPropSample',
          },
        },
      },
    };
    ownProps = {
      bar: 'baz',
      match: {
        params: {
          arrearsId: 'foo',
          submissionId: 'abc123',
        },
      },
    };
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      expect(mapStateToProps(mockState, ownProps)).toMatchSnapshot();
    });
    it('generates the correct props for a housing manager', () => {
      mockState = { ...mockState, user: { ...mockState.user, userType: 'manager' } };
      const mapStateToPropsResult = mapStateToProps(mockState, ownProps);
      expect(mapStateToPropsResult).toMatchSnapshot();
      expect(mapStateToPropsResult).toMatchObject({
        showReadOnlyView: false,
      });
    });
    it('generates the correct props for a housing manager who created the legal referral', () => {
      mockState = {
        ...mockState,
        user: {
          ...mockState.user,
          userType: 'manager',
          profile: {
            ...mockState.user.profile,
            id: 'userOne',
          },
        },
        legalReferral: {
          detail: {
            owner: {
              id: 'userOne',
            },
          },
        },
      };
      const mapStateToPropsResult = mapStateToProps(mockState, ownProps);
      expect(mapStateToPropsResult).toMatchSnapshot();
      expect(mapStateToPropsResult).toMatchObject({
        showReadOnlyView: true,
        showReadOnlyViewNotification: true,
      });
    });
  });
  it('generates the correct props for a senior manager when legalReferral is waiting for HM approval', () => {
    mockState = {
      ...mockState,
      user: {
        ...mockState.user,
        userType: 'manager',
        roles: ['SeniorManager'],
      },
      legalReferral: {
        detail: {
          progressStatus: 'CourtPackRequiresHoApproval',
        },
      },
    };
    const mapStateToPropsResult = mapStateToProps(mockState, ownProps);
    expect(mapStateToPropsResult).toMatchSnapshot();
    expect(mapStateToPropsResult).toMatchObject({
      showReadOnlyView: true,
      showReadOnlyViewNotification: false,
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let result;
    let redirectToDetailsPage;
    let mapStateToPropsResult;

    beforeEach(() => {
      mapStateToPropsResult = mapStateToProps(mockState, ownProps);
      dispatchProps = {
        dispatch: jest.fn(() => ({
          then: cb => {
            cb();
            return { catch: () => {} };
          },
        })),
      };
      actions.updateRibbon = jest.fn();
      legalReferralActions.cancelLegalReferral = jest.fn();
      legalReferralActions.getLegalReferral = jest.fn();
      legalReferralActions.setLegalReferralApproved = jest.fn();
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

    it('performs the correct actions for getLegalReferral', () => {
      result.getLegalReferral();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(legalReferralActions.getLegalReferral).toHaveBeenCalledWith(
        mapStateToPropsResult.submissionId
      );
    });

    it('performs the correct actions for onBack', () => {
      result.onBack();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for downloadFile', () => {
      const file = result.downloadFile('abc123', 'foo');
      expect(file).toEqual({ uri: 'abc123', name: 'foo' });
    });

    describe('onSubmit', () => {
      it('performs the correct actions for an approval', () => {
        result.onSubmit();
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(legalReferralActions.setLegalReferralApproved).toHaveBeenCalledWith('abc123');
        const addNotification = notificationActions.addNotification.mock.calls[0][0];
        expect(notificationActions.addNotification).toHaveBeenCalled();
        expect(addNotification).toMatchSnapshot();
        expect(redirectToDetailsPage).toHaveBeenCalled();
      });

      it('performs the correct actions for onCancel', () => {
        result.onSubmit('Reasons');
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(legalReferralActions.cancelLegalReferral).toHaveBeenCalledWith('abc123', {
          noteText: 'Reasons',
        });
        const addNotification = notificationActions.addNotification.mock.calls[0][0];
        expect(notificationActions.addNotification).toHaveBeenCalled();
        expect(addNotification).toMatchSnapshot();
        expect(redirectToDetailsPage).toHaveBeenCalled();
      });
    });
  });
});
