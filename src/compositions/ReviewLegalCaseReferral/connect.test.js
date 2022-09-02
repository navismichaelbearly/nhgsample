import * as actions from '../../ducks/ribbon';
import * as legalReferralActions from '../../ducks/legalReferral';
import * as notificationActions from '../../ducks/notifications';

import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

jest.mock('../../util/downloadFile', () => (uri, name) => ({ uri, name }));
jest.mock('../../constants/tokens', () => ({
  customerDashboard: 'customerDashboard',
}));

describe('ReviewLegalCaseReferral connector', () => {
  let mockState;
  let mapStateToPropsResult;
  let nonApprovalResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      bar: 'baz',
      match: {
        params: {
          arrearsId: 'foo',
          submissionId: 'abc123',
        },
      },
    };
    mapStateToPropsResult = mapStateToProps(mockState, ownProps);
    nonApprovalResult = mapStateToProps(
      {
        ...mockState,
        arrears: {
          ...mockState.arrears,
          items: [
            {
              businessUnit: 'PRH',
              id: 'foo',
              bar: 'baz',
              legalReferralCase: {
                requiresApproval: false,
                formName: 'Non approval form | legalReferralCaseFormName',
                lastSubmissionId: 'DEF456',
              },
              nospServeError: false,
              tenancyId: 'ABC123',
            },
          ],
        },
      },
      ownProps
    );
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      expect(mapStateToPropsResult).toMatchSnapshot();
    });

    it('generates the correct props when approval not required', () => {
      expect(nonApprovalResult).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let result;
    let redirectToDetailsPage;

    beforeEach(() => {
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
      legalReferralActions.setLegalReferralSubmitted = jest.fn();
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

    it('performs the correct actions for onSubmit', () => {
      result.onSubmit();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(legalReferralActions.setLegalReferralSubmitted).toHaveBeenCalledWith('abc123');

      const addNotification = notificationActions.addNotification.mock.calls[0][0];
      expect(notificationActions.addNotification).toHaveBeenCalled();
      expect(addNotification).toMatchSnapshot();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for onCancel', () => {
      result.onCancel({ foo: 'bar' });
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(legalReferralActions.cancelLegalReferral).toHaveBeenCalledWith('abc123', {
        foo: 'bar',
      });
      const addNotification = notificationActions.addNotification.mock.calls[0][0];
      expect(notificationActions.addNotification).toHaveBeenCalled();
      expect(addNotification).toMatchSnapshot();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for downloadFile', () => {
      const file = result.downloadFile('abc123', 'foo');
      expect(file).toEqual({ uri: 'abc123', name: 'foo' });
    });
  });
});
