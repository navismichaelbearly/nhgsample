import { connect } from 'react-redux';

import { clearNOSPError, serveNOSP } from '../../ducks/arrears';
import { setModalContent } from '../../ducks/modal';
import { addNotification } from '../../ducks/notifications';
import getHelpers from '../../util/stateHelpers';

export const mapStateToProps = (state, ownProps) => {
  const { get, getString } = getHelpers(state);
  return {
    arrearsId: ownProps.arrearsId,
    isLoading: get(['arrears', 'nospLoading']),
    error: get(['arrears', 'nospServeError']),
    errorMessage: getString(['genericErrorText']),
    labels: getString(['nosp', 'labels']),
  };
};

export const mergeProps = ({ arrearsId, ...stateProps }, { dispatch }, ownProps) => ({
  ...stateProps,
  onCancel: () => {
    dispatch(setModalContent());
    dispatch(clearNOSPError());
  },
  onSubmit: () => {
    dispatch(serveNOSP(arrearsId))
      .then(() => {
        dispatch(
          addNotification({
            dataBddPrefix: 'serveNOSP',
            icon: 'success',
            notificationType: 'confirmation',
            title: 'NOSP served',
          })
        );
        dispatch(setModalContent());
      })
      .catch(() => {});
  },
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
