import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import { Card, formatting, Loader, Typography } from 'nhh-styles';
import format from 'string-format';
import gt from 'ramda/src/gt';
import equals from 'ramda/src/equals';
import length from 'ramda/src/length';
import not from 'ramda/src/not';
import connect from './connect';
import {
  HighlightedAmount,
  HighlightedSection,
  HighlightedTitle,
  Seperator,
  StatsContainer,
  UnderLinedText,
} from './components';

const dataBddPrefix = 'myPatchStats';

export class PatchStatisticsCompositions extends PureComponent {
  componentDidMount() {
    const { getArrearsStatistics, patches } = this.props;
    if (this.canGetStats()) {
      const patch = patches[0].patchName;
      getArrearsStatistics(patch);
    }
  }

  componentDidUpdate(prevProps) {
    const patchesChanged = not(equals(prevProps.patches, this.props.patches));
    if (this.canGetStats() && patchesChanged) {
      const patch = this.props.patches[0].patchName;
      this.props.getArrearsStatistics(patch);
    }
  }

  canGetStats() {
    // Get the stats only if there is 1 patch
    return equals(length(this.props.patches), 1);
  }

  error() {
    const { errorText, patches } = this.props;

    const { multiplePatchesNotAllowed, noPatch } = errorText;

    const noPatches = not(length(patches));
    const patchesGt1 = gt(length(patches), 1);
    const patchesEqual1 = equals(length(patches), 1);

    let returnVal;

    if (noPatches) {
      returnVal = noPatch;
    } else if (patchesGt1) {
      returnVal = multiplePatchesNotAllowed;
    } else if (patchesEqual1) {
      returnVal = false;
    }
    return returnVal;
  }
  render() {
    const { arrearsStats, heading, labels, loading } = this.props;

    const {
      numberOfAccountsInArrears,
      numberOfAccountsWithHousingBenefitUniversalCredit,
      numberOfAppointmentsToBeMadeWithTenants,
      numberOfLegalReferralsToBeCompleted,
      numberOfLiveReferralsToWellfareAndBenefitsTeam,
      numberOfNospsToBeServed,
      numberOfOpenArrearsWithTenancySupport,
      percentageInArrears,
      totalValueOfArrears,
    } = arrearsStats;
    const {
      accountsInArrears,
      accountsWithHBUCSuspended,
      appointmentsToBeMade,
      liveReferralsToWBTeam,
      NOSPs,
      openTenancyReferrals,
      outstandingLegalReferrals,
      percentageOfRentCharged,
      totalArrears,
    } = labels;

    const fixedPercentage = percentageInArrears.toFixed();

    const error = this.error();
    if (loading) {
      return <Loader />;
    }
    return (
      <Card data-bdd={`${dataBddPrefix}-container`} hasAnimation={false}>
        <Typography.H4>{heading}</Typography.H4>
        <Card.Body>
          {error ? (
            <HighlightedSection data-bdd={`${dataBddPrefix}-error`}>{error}</HighlightedSection>
          ) : (
            <Fragment>
              <HighlightedSection>
                <HighlightedTitle>{totalArrears}</HighlightedTitle>
                <HighlightedAmount data-bdd={`${dataBddPrefix}-totalArrears`}>
                  {formatting.formatCurrency(totalValueOfArrears)}
                </HighlightedAmount>
                <UnderLinedText data-bdd={`${dataBddPrefix}-numberOfAccountsInArrears`}>
                  {format(accountsInArrears, { accounts: numberOfAccountsInArrears })}
                </UnderLinedText>
              </HighlightedSection>
              <Seperator />
              <StatsContainer>
                <li data-bdd={`${dataBddPrefix}-percentageInArrears`}>
                  {format(percentageOfRentCharged, { percentage: fixedPercentage })}
                </li>
                <li data-bdd={`${dataBddPrefix}-numberOfNospsToBeServed`}>
                  {format(NOSPs, { NOSPs: numberOfNospsToBeServed })}
                </li>
                <li data-bdd={`${dataBddPrefix}-numberOfLegalReferralsToBeCompleted`}>
                  {format(outstandingLegalReferrals, {
                    legalReferrals: numberOfLegalReferralsToBeCompleted,
                  })}
                </li>
                <li data-bdd={`${dataBddPrefix}-numberOfAccountsWithHousingBenefitUniversalCredit`}>
                  {format(accountsWithHBUCSuspended, {
                    accounts: numberOfAccountsWithHousingBenefitUniversalCredit,
                  })}
                </li>
                <li data-bdd={`${dataBddPrefix}-numberOfAppointmentsToBeMadeWithTenants`}>
                  {format(appointmentsToBeMade, {
                    appointments: numberOfAppointmentsToBeMadeWithTenants,
                  })}
                </li>
                <li data-bdd={`${dataBddPrefix}-numberOfLiveReferralsToWellfareAndBenefitsTeam`}>
                  {format(liveReferralsToWBTeam, {
                    referrals: numberOfLiveReferralsToWellfareAndBenefitsTeam,
                  })}
                </li>
                <li data-bdd={`${dataBddPrefix}-numberOfOpenArrearsWithTenancySupport`}>
                  {format(openTenancyReferrals, {
                    referrals: numberOfOpenArrearsWithTenancySupport,
                  })}
                </li>
              </StatsContainer>
            </Fragment>
          )}
        </Card.Body>
      </Card>
    );
  }
}

PatchStatisticsCompositions.defaultProps = {
  arrearsStats: {
    numberOfAccountsInArrears: 0,
    numberOfAccountsWithHousingBenefitUniversalCredit: 0,
    numberOfAppointmentsToBeMadeWithTenants: 0,
    numberOfLegalReferralsToBeCompleted: 0,
    numberOfLiveReferralsToWellfareAndBenefitsTeam: 0,
    numberOfNospsToBeServed: 0,
    numberOfOpenArrearsWithTenancySupport: 0,
    percentageInArrears: 0,
    totalValueOfArrears: 0,
  },
};

PatchStatisticsCompositions.propTypes = {
  errorText: PropTypes.shape({
    multiplePatchesNotAllowed: PropTypes.string.isRequired,
    noPatch: PropTypes.string.isRequired,
  }).isRequired,
  getArrearsStatistics: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  labels: PropTypes.shape({
    accountsInArrears: PropTypes.string.isRequired,
    accountsWithHBUCSuspended: PropTypes.string.isRequired,
    appointmentsToBeMade: PropTypes.string.isRequired,
    liveReferralsToWBTeam: PropTypes.string.isRequired,
    openTenancyReferrals: PropTypes.string.isRequired,
    outstandingLegalReferrals: PropTypes.string.isRequired,
    totalArrears: PropTypes.string.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  patches: PropTypes.array.isRequired,
  arrearsStats: PropTypes.shape({
    numberOfAccountsInArrears: PropTypes.number,
    numberOfAccountsWithHousingBenefitUniversalCredit: PropTypes.number,
    numberOfAppointmentsToBeMadeWithTenants: PropTypes.number,
    numberOfLegalReferralsToBeCompleted: PropTypes.number,
    numberOfLiveReferralsToWellfareAndBenefitsTeam: PropTypes.number,
    numberOfNospsToBeServed: PropTypes.number,
    numberOfOpenArrearsWithTenancySupport: PropTypes.number,
    percentageInArrears: PropTypes.number,
    totalValueOfArrears: PropTypes.number,
  }),
};

export default connect(PatchStatisticsCompositions);
