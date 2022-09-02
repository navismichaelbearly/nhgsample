import { connect } from 'react-redux';

import { displayLogin } from '../../ducks/user';

export const mapStateToProps = state => {
  const {
    navigation: { entryPoint },
    user,
  } = state;

  return {
    entryPoint,
    user,
  };
};

export const mergeProps = (stateProps, _, ownProps) => ({
  ...stateProps,
  displayLogin,
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
