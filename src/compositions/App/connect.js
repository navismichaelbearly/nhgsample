import compose from 'ramda/src/compose';
import pickAll from 'ramda/src/pickAll';
import { connect } from 'react-redux';

import { displayLogin, logout } from '../../ducks/user';
import { setEntryPoint } from '../../ducks/navigation';
import { hideModal } from '../../ducks/modal';

export const mapStateToProps = pickAll(['user', 'ribbon', 'modal']);

export const mergeProps = (stateProps, { dispatch }, ownProps) => ({
  ...stateProps,
  login: () => dispatch(displayLogin()),
  logout: url => dispatch(logout(url)),
  modal: {
    ...stateProps.modal,
    onClose: compose(dispatch, hideModal),
  },
  setEntryPoint: path => dispatch(setEntryPoint(path)),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
