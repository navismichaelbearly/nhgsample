import { connect } from 'react-redux';
import path from 'ramda/src/path';

import { getActivityHistory, invalidateActivityHistory } from '../../ducks/activities';

export const mapStateToProps = state => {
  const {
    activityHistory: { heading, labels },
  } = state.dictionary;

  return {
    activityHistory: path(['activities', 'history'], state),
    loading: path(['activities', 'loading'], state),
    heading,
    labels,
  };
};

export const mergeProps = (
  { arrears, tenants, vulnerabilityFlag, ...stateProps },
  { dispatch },
  ownProps
) => {
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);

  return {
    ...stateProps,
    arrearsId,
    invalidateActivityHistory: () => dispatch(invalidateActivityHistory()),
    getActivityHistory: () => dispatch(getActivityHistory(arrearsId)),
    ...ownProps,
  };
};

export default connect(mapStateToProps, null, mergeProps);
