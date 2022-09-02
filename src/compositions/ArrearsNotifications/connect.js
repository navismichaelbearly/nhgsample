import { connect } from 'react-redux';
import getHelpers from '../../util/stateHelpers';

export const mapStateToProps = state => {
  const { get } = getHelpers(state);
  return {
    notifications: get(['notifications', 'items']),
  };
};

export default connect(mapStateToProps);
