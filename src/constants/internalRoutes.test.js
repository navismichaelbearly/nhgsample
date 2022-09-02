import routes, { getTaskActivityRouteByActionType } from './internalRoutes';

describe('internalRoutes', () => {
  it('generates the correct routes when a payment plan exists', () => {
    const arrearDetails = {
      id: 'abc123',
      paymentPlan: { id: 'def456' },
    };
    expect(routes(arrearDetails)).toMatchSnapshot();
  });

  it('generates the correct routes when there is an active pause', () => {
    const arrearDetails = {
      id: 'abc123',
      pauseSummary: [{ id: 'def456', status: 'Active' }],
    };
    expect(routes(arrearDetails)).toMatchSnapshot();
  });

  it('generates the correct routes when there is a pause awaiting approval and user is an HO', () => {
    const arrearDetails = {
      id: 'abc123',
      pauseSummary: [{ id: 'def456', status: 'Draft' }],
    };
    expect(routes(arrearDetails)).toMatchSnapshot();
  });

  it('generates the correct routes when there is an active pause and a draft pause', () => {
    const arrearDetails = {
      id: 'abc123',
      pauseSummary: [
        { id: 'def456', status: 'Draft' },
        { id: 'ghi789', status: 'Active' },
      ],
    };
    expect(routes(arrearDetails)).toMatchSnapshot();
  });

  it('generates the correct routes when there is a pause awaiting approval and user is an HM', () => {
    const arrearDetails = {
      id: 'abc123',
      pauseSummary: [{ id: 'def456', status: 'Draft' }],
    };
    expect(routes(arrearDetails, true)).toMatchSnapshot();
  });

  it('generates the correct routes for add interaction', () => {
    expect(
      getTaskActivityRouteByActionType({ actionType: 'addinteraction', arrearsId: 'abc123' })
    ).toEqual('/arrears-details/abc123/interaction/create');
  });

  it('generates the correct routes for add note', () => {
    expect(
      getTaskActivityRouteByActionType({ actionType: 'addnote', arrearsId: 'abc123' })
    ).toEqual('/arrears-details/abc123/note/create');
  });

  it('generates the correct routes for send correspondence', () => {
    expect(
      getTaskActivityRouteByActionType({ actionType: 'sendcorrespondence', arrearsId: 'abc123' })
    ).toEqual('/arrears-details/abc123/send-correspondence/create');
  });

  describe('when actionType=legalreferral', () => {
    const newProps = withLgArgs => ({
      actionType: 'legalreferral',
      arrearsId: 'myArrears',
      legalReferral: {
        status: '',
        userRoles: [],
        ...withLgArgs,
      },
    });
    describe('Legal Referral Task', () => {
      let caseProps;
      beforeEach(() => {
        caseProps = {
          legalReferralId: '',
          canCreateLegalReferral: true,
          status: 'CourtPackRequiresHoApproval',
        };
      });
      it('returns create link for HO', () => {
        const myProps = newProps({ ...caseProps, userRoles: ['StandardUser'] });
        const expected = '/arrears-details/myArrears/legal-case-referral/create';
        expect(getTaskActivityRouteByActionType(myProps)).toEqual(expected);
      });
      it('returns create link for HM', () => {
        const myProps = newProps({ ...caseProps, userRoles: ['HousingManager'] });
        const expected = '/arrears-details/myArrears/legal-case-referral/create';
        expect(getTaskActivityRouteByActionType(myProps)).toEqual(expected);
      });
      it('returns empty link for SM', () => {
        const myProps = newProps({ ...caseProps, userRoles: ['SeniorManager'] });
        const expected = '';
        expect(getTaskActivityRouteByActionType(myProps)).toEqual(expected);
      });
      it('returns no link when canCreateLegalReferral=false', () => {
        const myProps = newProps({
          ...caseProps,
          canCreateLegalReferral: false,
          userRoles: ['StandardUser'],
        });
        const expected = '';
        expect(getTaskActivityRouteByActionType(myProps)).toEqual(expected);
      });
    });
    describe('Owner Sign-Off Task', () => {
      let caseProps;
      beforeEach(() => {
        caseProps = {
          legalReferralId: 'myLegalReferral',
          canCreateLegalReferral: false,
          status: 'CourtPackRequiresHoApproval',
        };
      });
      it('returns review link for HO', () => {
        const myProps = newProps({ ...caseProps, userRoles: ['StandardUser'] });
        const expected = '/arrears-details/myArrears/legal-case-referral/myLegalReferral/review';
        expect(getTaskActivityRouteByActionType(myProps)).toEqual(expected);
      });
      it('returns review link for HM', () => {
        const myProps = newProps({ ...caseProps, userRoles: ['HousingManager'] });
        const expected = '/arrears-details/myArrears/legal-case-referral/myLegalReferral/review';
        expect(getTaskActivityRouteByActionType(myProps)).toEqual(expected);
      });
      it('returns approve (Read Only) link for SM', () => {
        const myProps = newProps({ ...caseProps, userRoles: ['SeniorManager'] });
        const expected = '/arrears-details/myArrears/legal-case-referral/myLegalReferral/approve';
        expect(getTaskActivityRouteByActionType(myProps)).toEqual(expected);
      });
    });
    describe('Manager Sign-Off Task', () => {
      let caseProps;
      beforeEach(() => {
        caseProps = {
          legalReferralId: 'myLegalReferral',
          canCreateLegalReferral: false,
          status: 'CourtPackRequiresHomApproval',
        };
      });
      it('returns approve (Read Only) link for HO', () => {
        const myProps = newProps({ ...caseProps, userRoles: ['StandardUser'] });
        const expected = '/arrears-details/myArrears/legal-case-referral/myLegalReferral/approve';
        expect(getTaskActivityRouteByActionType(myProps)).toEqual(expected);
      });
      it('returns approve link for HM', () => {
        const myProps = newProps({ ...caseProps, userRoles: ['HousingManager'] });
        const expected = '/arrears-details/myArrears/legal-case-referral/myLegalReferral/approve';
        expect(getTaskActivityRouteByActionType(myProps)).toEqual(expected);
      });
      it('returns approve (Read Only) link for HM', () => {
        const myProps = newProps({ ...caseProps, userRoles: ['HousingManager'] });
        const expected = '/arrears-details/myArrears/legal-case-referral/myLegalReferral/approve';
        expect(getTaskActivityRouteByActionType(myProps)).toEqual(expected);
      });
      it('returns approve link for SM', () => {
        const myProps = newProps({ ...caseProps, userRoles: ['SeniorManager'] });
        const expected = '/arrears-details/myArrears/legal-case-referral/myLegalReferral/approve';
        expect(getTaskActivityRouteByActionType(myProps)).toEqual(expected);
      });
    });
  });
});
