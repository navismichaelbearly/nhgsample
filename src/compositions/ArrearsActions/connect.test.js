import { mapStateToProps } from './connect';

import legalReferralStatus from '../../constants/legalReferral';
import { SYSTEM_PAUSED } from '../../constants/arrears';
import state from '../../../__mocks__/state';

describe('ArrearsDetail connector', () => {
  let mockState;
  let ownProps;
  let mapStateToPropsResult;

  beforeEach(() => {
    mockState = state();

    ownProps = {
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

    describe('Hide pause actions', () => {
      it('generates the correct props when status is SYSTEM_PAUSED', () => {
        const newState = {
          ...mockState,
          arrears: {
            ...mockState.arrears,
            items: [
              {
                ...mockState.arrears.items[0],
                status: SYSTEM_PAUSED,
              },
            ],
          },
        };
        mapStateToPropsResult = mapStateToProps(newState, ownProps);
        expect(mapStateToPropsResult).toMatchSnapshot();
      });
    });

    describe('serve NOSP', () => {
      it('generates the correct props when canServeNosp is enabled', () => {
        const newState = {
          ...mockState,
          arrears: {
            ...mockState.arrears,
            items: [
              {
                ...mockState.arrears.items[0],
                canServeNosp: true,
              },
            ],
          },
        };
        mapStateToPropsResult = mapStateToProps(newState, ownProps);
        expect(mapStateToPropsResult).toMatchSnapshot();
      });
    });

    describe('Payment Plan', () => {
      it('generates the correct props when a payment plan exists', () => {
        const newState = {
          ...mockState,
          arrears: {
            ...mockState.arrears,
            items: [
              {
                ...mockState.arrears.items[0],
                paymentPlan: { id: 'abc123' },
              },
            ],
          },
        };
        mapStateToPropsResult = mapStateToProps(newState, ownProps);
        expect(mapStateToPropsResult).toMatchSnapshot();
      });
    });

    describe('create pause', () => {
      it('generates the correct props when there is an active pause', () => {
        const newState = {
          ...mockState,
          arrears: {
            ...mockState.arrears,
            items: [
              {
                ...mockState.arrears.items[0],
                pauseSummary: [{ id: 'abc123', status: 'Draft' }],
              },
            ],
          },
        };
        mapStateToPropsResult = mapStateToProps(newState, ownProps);
        expect(mapStateToPropsResult).toMatchSnapshot();
      });

      it('generates the correct props when there is a pause awaiting approval and user is an HO', () => {
        const newState = {
          ...mockState,
          arrears: {
            ...mockState.arrears,
            items: [
              {
                ...mockState.arrears.items[0],
                pauseSummary: [{ id: 'def456', status: 'Active' }],
              },
            ],
          },
        };
        mapStateToPropsResult = mapStateToProps(newState, ownProps);
        expect(mapStateToPropsResult).toMatchSnapshot();
      });

      it('generates the correct props when there is a pause awaiting approval and user is an HM', () => {
        const newState = {
          ...mockState,
          arrears: {
            ...mockState.arrears,
            items: [
              {
                ...mockState.arrears.items[0],
                pauseSummary: [{ id: 'ghi789', status: 'Active' }],
              },
            ],
          },
          user: { userType: 'manager', roles: ['manager'] },
        };
        mapStateToPropsResult = mapStateToProps(newState, ownProps);
        expect(mapStateToPropsResult).toMatchSnapshot();
      });
    });

    describe('Legal referral action', () => {
      it('generates the correct props when there is a legal referring waiting for submission', () => {
        const newState = {
          ...mockState,
          arrears: {
            ...mockState.arrears,
            items: [
              {
                ...mockState.arrears.items[0],
                legalReferralCase: {
                  ...mockState.arrears.items[0].legalReferralCase,
                  canCreateLegalReferral: true,
                  lastSubmissionId: 'abc123',
                },
              },
            ],
          },
        };
        mapStateToPropsResult = mapStateToProps(newState, ownProps);
        expect(mapStateToPropsResult).toMatchSnapshot();
      });

      it('generates the correct props when there is a legal referring waiting for manager approval', () => {
        const newState = {
          ...mockState,
          arrears: {
            ...mockState.arrears,
            items: [
              {
                ...mockState.arrears.items[0],
                legalReferral: {
                  caseId: 'case id',
                },
                legalReferralCase: {
                  ...mockState.arrears.items[0].legalReferralCase,
                  canCreateLegalReferral: true,
                  lastSubmissionId: 'abc123',
                  status: legalReferralStatus.requiresApproval,
                },
              },
            ],
          },
        };
        mapStateToPropsResult = mapStateToProps(newState, ownProps);
        expect(mapStateToPropsResult).toMatchSnapshot();
      });
    });
  });
});
