import { connect } from 'react-redux';
import path from 'ramda/src/path';
import pickAll from 'ramda/src/pickAll';

import { setModalContent } from '../../ducks/modal';
import { getTasks, invalidateTasks } from '../../ducks/tasks';
import getHelpers from '../../util/stateHelpers';
import { isUserSeniorManager } from '../../util/userRoles';
import { CANCELLED, COMPLETED, OPEN } from '../../constants/taskStatuses';

export const mapStateToProps = (state, ownProps) => {
  const { get } = getHelpers(state);
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const isLoading = get(['tasks', 'loading']);
  const {
    arrearsDetails: {
      tasks: { heading, labels },
    },
    archivedTasks,
  } = state.dictionary;
  const user = pickAll(['roles', 'profile'], get(['user']));

  const arrears = get(['arrears', 'items']);
  const currentArrear = arrears.find(arrear => arrear.id === arrearsId) || {};
  const canCreateLegalReferral =
    !isUserSeniorManager(user.roles) &&
    path(['legalReferralCase', 'canCreateLegalReferral'], currentArrear);
  const legalReferralActionStatus = path(['legalReferralCase', 'status'], currentArrear);
  const legalReferralId = path(['legalReferral', 'caseId'], currentArrear);

  return {
    archivedTasksLabels: archivedTasks,
    canCreateLegalReferral,
    legalReferralId,
    legalReferralActionStatus,
    arrearsId,
    isLoading,
    tasks: get(['tasks', 'items']),
    heading,
    labels,
    user,
  };
};

export const mergeProps = ({ arrearsId, ...stateProps }, { dispatch }, ownProps) => ({
  ...stateProps,
  arrearsId,
  invalidateTasks: () => dispatch(invalidateTasks()),
  openTaskModal: modalContent => {
    if (modalContent) {
      dispatch(setModalContent(modalContent));
    }
  },
  getArrearTasks: (archived, opts) =>
    dispatch(
      getTasks({
        EntityId: arrearsId,
        EntityType: 'Arrears',
        Statuses: archived ? `${CANCELLED},${COMPLETED}` : OPEN,
        skipFetchRoles: isUserSeniorManager(stateProps.user.roles),
        ...opts,
      })
    ),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
