import { connect } from 'react-redux';
import path from 'ramda/src/path';
import remove from 'ramda/src/remove';

import {
  getWelfareReform,
  patchWelfareReform,
  getAPAStatus,
  getUCStatus,
} from '../../ducks/welfareReform';
import { updateRibbon } from '../../ducks/ribbon';
import getHelpers from '../../util/stateHelpers';
import {
  employeeDashboardSearchResults,
  dashboardDetailsForCustomer,
} from '../../constants/routes';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs } = getHelpers(state);
  const {
    arrearsDetails: { heading: arrearsDetailsHeading },
    welfareReformDetailsEdit: { paymentDayError, labels, lastUpdated, welfareReformDetails },
  } = state.dictionary;
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const tenancyParam = path(['match', 'params', 'tenancyId'], ownProps);
  const customerId = path(['match', 'params', 'id'], ownProps);
  const apaStatusObject = get(['welfareReform', 'apaStatus']);
  const ucStatusObject = get(['welfareReform', 'ucStatus']);

  const apaStatuses = apaStatusObject;
  const ucArrearsPaymentStatuses = ucStatusObject;

  let redirectToDetailsPage;
  let hidePropertyInfo;
  if (arrearsId) {
    redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);
    hidePropertyInfo = false;
  } else {
    redirectToDetailsPage = () => ownProps.history.goBack();
    hidePropertyInfo = true;
  }
  const welfareReform = get(['welfareReform', 'welfareReform']);
  const tenancy = get(['tenancy', 'tenancyReferenceNumber']);
  return {
    arrearsId,
    breadcrumb: getBreadcrumbs(
      welfareReformDetails,
      {},
      tenancyParam
        ? [
            {
              label: 'Search Results',
              key: 'searchResults',
              path: employeeDashboardSearchResults,
            },
            {
              label: 'Customer Details',
              key: 'customerDetails',
              path: dashboardDetailsForCustomer(customerId),
            },
          ]
        : [
            {
              label: arrearsDetailsHeading,
              to: `/arrears-details/${arrearsId}`,
            },
          ]
    ),
    paymentDayError,
    hidePropertyInfo,
    heading: welfareReformDetails,
    labels,
    lastUpdated,
    redirectToDetailsPage,
    apaStatuses,
    ucArrearsPaymentStatuses,
    tenancyId: tenancy || tenancyParam,
    welfareReform,
  };
};

export const mergeProps = (
  {
    arrearsId,
    apaStatuses,
    breadcrumb,
    heading,
    hidePropertyInfo,
    redirectToDetailsPage,
    tenancyId,
    userId,
    ucArrearsPaymentStatuses,
    welfareReform,
    ...stateProps
  },
  { dispatch },
  ownProps
) => {
  const success = () => {
    redirectToDetailsPage();
  };
  return {
    ...stateProps,
    hidePropertyInfo,
    tenancyId,
    apaStatuses,
    ucArrearsPaymentStatuses,
    getWelfareReformDetails: () => dispatch(getWelfareReform(tenancyId)),
    getOptionSets: () => dispatch(getAPAStatus()).then(dispatch(getUCStatus())),
    welfareReform,
    onBack: () => redirectToDetailsPage(),
    onSubmit: payload => {
      const params = { ...payload };
      dispatch(patchWelfareReform(tenancyId, params)).then(() => {
        success();
      });
    },
    updatePageHeader: () =>
      dispatch(
        updateRibbon({
          title: heading,
          breadcrumb: tenancyId ? remove(1, 1, breadcrumb) : breadcrumb,
        })
      ),
    ...ownProps,
  };
};

export default connect(mapStateToProps, null, mergeProps);
