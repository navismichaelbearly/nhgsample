import { mergeProps, mapStateToProps } from './connect';
import * as interactionActions from '../../ducks/interactions';
import * as notificationActions from '../../ducks/notifications';
import * as ribbonActions from '../../ducks/ribbon';
import * as tenancyActions from '../../ducks/tenancy';
import state from '../../../__mocks__/state';
import constructDateFromTimeAndDate from '../../util/constructDateFromTimeAndDate';

jest.mock('uuid/v4', () => () => '1234');

describe('CreateInteraction connector', () => {
  let dispatchProps;
  let mockState;
  let mapStateToPropsResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      history: {
        push: jest.fn(),
      },
      match: {
        params: {
          arrearsId: 'foo',
        },
      },
    };
  });

  describe('mapStateToProps', () => {
    beforeEach(() => {
      mapStateToPropsResult = mapStateToProps(mockState, ownProps);
    });
    it('generates the correct props', () => {
      expect({
        ...mapStateToPropsResult,
        timeSlots: [],
      }).toMatchSnapshot();
    });

    describe('mergeProps', () => {
      let result;
      let redirectToDetailsPage;
      let redirectToPage;
      let redirectToMediaPage;
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
        interactionActions.createInteraction = jest.fn();
        interactionActions.clearInteractionError = jest.fn();
        interactionActions.getActivityTypes = jest.fn();
        interactionActions.getThirdPartiesContact = jest.fn();
        notificationActions.addNotification = jest.fn();
        ribbonActions.updateRibbon = jest.fn();
        tenancyActions.getTenancy = jest.fn();

        redirectToMediaPage = jest.fn();
        redirectToDetailsPage = jest.fn();
        redirectToPage = jest.fn();
        result = mergeProps(
          { ...mapStateToPropsResult, redirectToDetailsPage, redirectToPage, redirectToMediaPage },
          dispatchProps,
          ownProps
        );
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('generates the correct props', () => {
        expect({
          ...result,
          timeSlots: [],
        }).toMatchSnapshot();
      });

      it('performs the correct action when onBack fires', () => {
        result.onBack();
        expect(redirectToDetailsPage).toHaveBeenCalled();
      });

      it('performs the correct action for clearError', () => {
        result.clearError();
        expect(interactionActions.clearInteractionError).toHaveBeenCalled();
      });

      it('performs the correct action for getActivityTypes', () => {
        result.getActivityTypes();
        expect(interactionActions.getActivityTypes).toHaveBeenCalled();
      });

      it('performs the correct action for getTenantDetails', () => {
        result.getTenantDetails();
        expect(tenancyActions.getTenancy).toHaveBeenCalled();
      });

      it('performs the correct action for getThirdParties', () => {
        result.thirdParty.getThirdParties();
        expect(interactionActions.getThirdPartiesContact).toHaveBeenCalled();
      });

      describe('onSubmit', () => {
        let payload;
        let targetPayload;

        beforeEach(() => {
          payload = {
            activityKind: 'Outbound',
            date: new Date(2018, 1, 1),
            description: 'some description',
            interactionType: 'Email',
            interactingParty: 'asdasdasd',
            time: '09:30',
          };

          targetPayload = {
            id: '1234',
            activityTime: constructDateFromTimeAndDate(payload.date, payload.time),
            activityType: payload.interactionType,
            description: payload.description,
            subject: 'Arrears Interaction',
            from: {
              partyId: mapStateToPropsResult.fromPartyId,
              partyType: mapStateToPropsResult.fromPartyType,
            },
            inbound: !!(payload.activityKind === 'Inbound'),
            to: {
              partyId: payload.interactingParty,
              partyType: mapStateToPropsResult.toPartyType,
            },
          };
        });

        afterEach(() => {
          jest.clearAllMocks();
        });

        it('performs the correct actions for onSubmit', () => {
          result.onSubmit(payload);
          expect(dispatchProps.dispatch).toHaveBeenCalled();
          expect(interactionActions.createInteraction).toHaveBeenCalledWith(
            ownProps.match.params.arrearsId,
            targetPayload
          );

          expect(notificationActions.addNotification).toHaveBeenCalled();
          expect(notificationActions.addNotification.mock.calls[0][0]).toMatchSnapshot();
          expect(redirectToPage).toHaveBeenCalled();
        });

        it('redirects to media page when requested', () => {
          result.onSubmit(payload, '/task', true);
          expect(redirectToMediaPage).toHaveBeenCalledWith('1234', '/task');
        });
      });
    });
  });
});
