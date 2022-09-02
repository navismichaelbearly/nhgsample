import { connect } from 'react-redux';
import path from 'ramda/src/path';

import { getArrearsDetail, getArrearsSummary } from '../../ducks/arrears';
import getHelpers from '../../util/stateHelpers';
import { flattenPatches, sortPatchList } from '../../util/patch';

export const mapStateToProps = (state, ownProps) => {
  const { get, getString } = getHelpers(state);
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);

  const profile = get(['user', 'profile']);

  return {
    arrearsId,
    errorMessage: getString(['errorMessage']),
    heading: getString(['arrearsDashboard', 'heading']),
    loading: arrearsId ? get(['arrears', 'loadingArrears']) : false,
    patches: sortPatchList(get(['patch', 'patchList']), profile),
    ribbon: state.ribbon,
  };
};

export const mergeProps = ({ arrearsId, patches, ...stateProps }, { dispatch }, ownProps) => ({
  ...stateProps,
  getArrearsDetail: () =>
    arrearsId
      ? dispatch(getArrearsDetail(arrearsId))
      : dispatch(getArrearsSummary({ patches: flattenPatches(patches) })),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
