import { connect } from 'react-redux';
import path from 'ramda/src/path';

import getHelpers from '../../util/stateHelpers';
import { updateRibbon } from '../../ducks/ribbon';

export const mapStateToProps = (state, ownProps) => {
  const { getBreadcrumbs } = getHelpers(state);
  const {
    arrearsDetails: { arrearsDetailsLabels, heading: arrearsDetailHeading },
    archivedTasks: { breadcrumbs: pageTitle },
  } = state.dictionary;
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);

  return {
    arrearsDetailsLabels,
    breadcrumb: getBreadcrumbs(
      pageTitle,
      {},
      {
        label: arrearsDetailHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    arrearsDetailHeading,
    arrearsId,
    pageTitle,
  };
};

export const mergeProps = (
  { breadcrumb, arrearsDetailHeading, pageTitle, ...stateProps },
  { dispatch },
  ownProps
) => ({
  ...stateProps,
  arrearsDetailHeading,
  updatePageHeader: () => dispatch(updateRibbon({ title: pageTitle, breadcrumb })),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
