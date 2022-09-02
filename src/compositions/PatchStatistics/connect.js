import { connect } from 'react-redux';

import { getArrearsStatistics } from '../../ducks/arrears';
import getHelpers from '../../util/stateHelpers';

export const mapStateToProps = state => {
  const { get, getString } = getHelpers(state);

  return {
    errorText: getString(['patchStatistics', 'errorText']),
    heading: getString(['patchStatistics', 'heading']),
    labels: getString(['patchStatistics', 'labels']),
    loading: get(['arrears', 'loadingArrearsStats']),
    arrearsStats: get(['arrears', 'stats']),
    patches: get(['patch', 'patchList']),
  };
};

export const mergeProps = (stateProps, { dispatch }, ownProps) => ({
  ...stateProps,
  getArrearsStatistics: patch => dispatch(getArrearsStatistics(patch)),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
