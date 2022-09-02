import { connect } from 'react-redux';
import path from 'ramda/src/path';
import { addNotification } from '../../ducks/notifications';
import { updateRibbon } from '../../ducks/ribbon';
import { createReferralCase, getReferralTeams } from '../../ducks/referral';
import getHelpers from '../../util/stateHelpers';

export const mapStateToProps = (state, ownProps) => {
  const { getBreadcrumbs, getString, get } = getHelpers(state);
  const {
    arrearsDetails: { heading: arrearsDetailsHeading },
    referArrearsCase: referArrearsCaseText,
  } = state.dictionary;
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);
  const referralTeams = get(['referral', 'referralTeams']);
  const referralError = get(['referral', 'error']);
  const isLoading = get(['referral', 'loading']);
  const errorMessage = getString(['errorMessage']);
  return {
    arrearsId,
    breadcrumb: getBreadcrumbs(
      referArrearsCaseText.heading1,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    fullDetailsInHistory: referArrearsCaseText.fullDetailsInHistory,
    heading: referArrearsCaseText.heading1,
    referralTeams,
    text: referArrearsCaseText,
    redirectToDetailsPage,
    submitText: referArrearsCaseText.submit,
    successMessage: referArrearsCaseText.successMessage,
    referredFor: referArrearsCaseText.referredFor,
    referralError,
    errorMessage,
    isLoading,
  };
};

export const mergeProps = (
  {
    arrears,
    arrearsId,
    fullDetailsInHistory,
    heading,
    breadcrumb,
    redirectToDetailsPage,
    referredFor,
    submitText,
    successMessage,
    ...stateProps
  },
  { dispatch }
) => ({
  ...stateProps,
  getReferralTeams: () => dispatch(getReferralTeams()),
  onBack: () => redirectToDetailsPage(),
  onSubmit: (details, referralTeam) => {
    dispatch(createReferralCase(arrearsId, { referrableTeamId: referralTeam.id, text: details }))
      .then(() => {
        redirectToDetailsPage();
        const notificationLines = [
          {
            dataBdd: 'name',
            text: `${referredFor}: ${referralTeam.name}`,
          },
          {
            text: fullDetailsInHistory,
          },
        ];
        dispatch(
          addNotification({
            dataBddPrefix: 'referArrearsCase',
            lines: notificationLines,
            hideCloseButton: true,
            icon: 'success',
            notificationType: 'confirmation',
            title: successMessage,
          })
        );
      })
      .catch(() => {});
  },
  updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
});

export default connect(mapStateToProps, null, mergeProps);
