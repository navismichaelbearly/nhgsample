import * as notificationsActions from '../../ducks/notifications';
import * as ribbonActions from '../../ducks/ribbon';
import * as referralActions from '../../ducks/referral';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('ReferArrearsCase connector', () => {
  let dispatchProps;
  let ownProps;
  let mockState;
  let mapStateToPropsResult;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      history: {
        push: jest.fn(),
      },
      match: {
        params: {
          arrearsId: 'providedArrearsId',
        },
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
          dispatch: jest.fn().mockImplementation(() => Promise.resolve()),
        };
        notificationsActions.addNotification = jest.fn();
        ribbonActions.updateRibbon = jest.fn();
        referralActions.createReferralCase = jest.fn();
        referralActions.getReferralTeams = jest.fn();
        result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('generates the correct props', () => {
        expect(result).toMatchSnapshot();
      });

      it('performs the correct actions when getReferralTeams fires', () => {
        result.getReferralTeams();
        expect(referralActions.getReferralTeams).toHaveBeenCalled();
      });

      it('performs the correct actions when onBack fires', () => {
        result.onBack();
        expect(ownProps.history.push).toHaveBeenCalledWith(
          `/arrears-details/${ownProps.match.params.arrearsId}`
        );
      });

      describe('onSubmit', () => {
        const details = 'providedDetails';
        const referralTeam = { id: 'teamId', name: 'teamName' };
        beforeEach(() => {
          result.onSubmit(details, referralTeam);
        });
        it('performs the correct actions when onSubmit fires', () => {
          expect(dispatchProps.dispatch).toHaveBeenCalled();
          expect(referralActions.createReferralCase).toHaveBeenCalledWith(
            ownProps.match.params.arrearsId,
            { referrableTeamId: referralTeam.id, text: details }
          );
          expect(ownProps.history.push.mock.calls).toMatchSnapshot();
          expect(notificationsActions.addNotification).toHaveBeenCalled();
          expect(notificationsActions.addNotification.mock.calls).toMatchSnapshot();
        });
      });

      it('performs the correct actions when updatePageHeader fires', () => {
        result.updatePageHeader();
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(ribbonActions.updateRibbon.mock.calls).toMatchSnapshot();
      });
    });
  });
});
