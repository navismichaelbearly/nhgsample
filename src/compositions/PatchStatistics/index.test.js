import React from 'react';
import { shallow } from 'enzyme';

import { PatchStatisticsCompositions } from './';

function sel(id) {
  return `[data-bdd="${id}"]`;
}

describe('<PatchStatisticsCompositions />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      errorText: {
        noPatch: 'Patch stats not available when no patch added',
        multiplePatchesNotAllowed: 'Patch stats not available when multiple patches selected',
      },
      getArrearsStatistics: jest.fn(),
      heading: 'My patch stats',
      labels: {
        accountsInArrears: 'Across {accounts} active Arrears cases',
        accountsWithHBUCSuspended: '{accounts} accounts with HB/UC suspended',
        appointmentsToBeMade: '{appointments} appointments to be made',
        NOSPs: '{NOSPs} NOSPs to be served',
        liveReferralsToWBTeam: '{referrals} live referrals to W&B team',
        openTenancyReferrals: '{referrals} open tenancy support referrals',
        outstandingLegalReferrals: '{legalReferrals} legal referrals outstanding',
        percentageOfRentCharged:
          '{percentage}% of accounts on your patch have an active Arrears case',
        totalArrears: 'Cash value of arrears',
      },
      loading: false,
      patches: [
        {
          fullname: 'user fullname',
          name: 'test name',
          patchName: 'PSUA88282',
          src: 'http://url.com',
        },
      ],
      arrearsStats: {
        numberOfAccountsInArrears: 1,
        totalValueOfArrears: 2,
        percentageInArrears: 0,
        numberOfNospsToBeServed: 4,
        numberOfLegalReferralsToBeCompleted: 5,
        numberOfAccountsWithHousingBenefitUniversalCredit: 6,
        numberOfAppointmentsToBeMadeWithTenants: 7,
        numberOfLiveReferralsToWellfareAndBenefitsTeam: 8,
        numberOfOpenArrearsWithTenancySupport: 9,
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page', () => {
    el = shallow(<PatchStatisticsCompositions {...props} />);
    expect(el).toMatchSnapshot();
  });

  it('should render the page with the loading indicator', () => {
    props.loading = true;
    el = shallow(<PatchStatisticsCompositions {...props} />);
    expect(el).toMatchSnapshot();
  });

  it('should call getArrearsStatistics if only one patch exists', () => {
    shallow(<PatchStatisticsCompositions {...props} />);
    expect(props.getArrearsStatistics).toHaveBeenCalled();
  });

  it('should not call getArrearsStatistics if multiple patches exist ', () => {
    props.patches = [1, 2, 3];
    shallow(<PatchStatisticsCompositions {...props} />);
    expect(props.getArrearsStatistics).not.toHaveBeenCalled();
  });

  it('should not call getArrearsStatistics if there are no patches ', () => {
    props.patches = [];
    shallow(<PatchStatisticsCompositions {...props} />);
    expect(props.getArrearsStatistics).not.toHaveBeenCalled();
  });

  it('should show the correct error when more than are more than one patches', () => {
    props.patches = [1, 2, 3];
    const result = shallow(<PatchStatisticsCompositions {...props} />);
    expect(result.find(sel('myPatchStats-error'))).toMatchSnapshot();
  });

  it('should show the correct error when there are no patches', () => {
    props.patches = [];
    const result = shallow(<PatchStatisticsCompositions {...props} />);
    expect(result.find(sel('myPatchStats-error'))).toMatchSnapshot();
  });

  it('should call getArrearsStatistics when a new patch is passed in as prop', () => {
    const newPatches = [
      {
        fullname: 'user fullname',
        name: 'test name',
        patchName: 'newPatchName',
        src: 'http://url.com',
      },
    ];
    const wrapper = shallow(<PatchStatisticsCompositions {...props} />);
    wrapper.setProps({ patches: newPatches });
    expect(props.getArrearsStatistics).toHaveBeenCalledWith(newPatches[0].patchName);
  });
});
