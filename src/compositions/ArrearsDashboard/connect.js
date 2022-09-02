import clone from 'ramda/src/clone';
import { connect } from 'react-redux';
import isEmpty from 'ramda/src/isEmpty';

import { getArrearsSummary } from '../../ducks/arrears';
import {
  invalidateSummaryTasks,
  getSummaryTasks,
  getTasksSummary,
  getUserTasksSummary,
} from '../../ducks/tasks';
import getHelpers from '../../util/stateHelpers';
import { updateRibbon } from '../../ducks/ribbon';
import { showPatchSelect } from '../../ducks/patch';
import { sortPatchList, flattenPatches, flattenUsers } from '../../util/patch';

export const mapStateToProps = state => {
  const { get, getBreadcrumbs, getString } = getHelpers(state);

  const profile = get(['user', 'profile']);

  return {
    arrears: get(['arrears', 'items']),
    breadcrumb: getBreadcrumbs(),
    cardLabels: getString(['arrearsSummaryCards']),
    filterLabel: get(['arrears', 'filterLabel']),
    tasksNoDataMsg: getString(['tasksNoDataMsg']),
    myTasksNoDataMsg: getString(['myTasksNoDataMsg']),
    selectedUserTasksNoDataMsg: getString(['selectedUserTasksNoDataMsg']),
    arrearsNoDataMsg: getString(['arrearsNoDataMsg']),
    taskCardLabels: getString(['taskSummaryCards']),
    heading: getString(['arrearsDashboard', 'heading']),
    loadingArrears: get(['arrears', 'loadingArrears']),
    loadingTasks: get(['tasks', 'loading']),
    viewMoreLoading: get(['tasks', 'viewMoreLoading']),
    patches: clone(sortPatchList(get(['patch', 'patchList']), profile)),
    profile,
    resultsCount: get(['arrears', 'resultsCount']),
    selectedUserTasksCount: get(['tasks', 'userItemsCount'], 0),
    youText: getString(['patchSelect', 'you']),
    selectedUserTasks: get(['tasks', 'userItems'], []),
    myTasks: get(['tasks', 'mySummaryItems']),
    tasks: get(['tasks', 'summaryItems']),
  };
};

export const mergeProps = (
  { breadcrumb, heading, patches, profile, ...stateProps },
  { dispatch },
  ownProps
) => {
  const getSummary = (opts, isMine /* used when querying for 'My tasks' */) =>
    dispatch(
      getTasksSummary(
        {
          statuses: 'open',
          EntityType: 'Arrears',
          ...opts,
        },
        isMine
      )
    );
  const flattedUsers = !isEmpty(flattenUsers(patches))
    ? flattenUsers(patches)
        .split(',')
        .filter(e => e !== profile.id)
    : [];
  const userParams = {
    owners: flattedUsers.toString(),
    statuses: 'open',
    EntityType: 'Arrears',
    pageSize: 6,
  };
  const flattenPatchesResults = flattenPatches(patches);
  const patchParams = {
    Patches: flattenPatchesResults,
    statuses: 'open',
    EntityType: 'Arrears',
    pageSize: 6,
  };
  return {
    ...stateProps,
    profile,
    patches,
    getArrearsSummary: opts =>
      dispatch(getArrearsSummary({ patches: flattenPatchesResults, ...opts })),
    getTasksSummary: opts => dispatch(getTasksSummary({ ...opts })),
    getUserTasksSummary: () => {
      dispatch(getUserTasksSummary({ ...userParams }));
    },
    getMyTasksSummary: () => getSummary({ userId: profile.id }, true),
    getSelectedUserTasks: opts => {
      const args = { ...userParams, ...opts };
      dispatch(getUserTasksSummary({ ...args }));
    },
    getSummaryTasks: opts => {
      const args = { ...patchParams, ...opts };
      dispatch(getSummaryTasks({ ...args }));
    },
    onOpenPatchSelect: () => dispatch(showPatchSelect()),
    invalidateTasks: () => dispatch(invalidateSummaryTasks()),
    updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
    ...ownProps,
  };
};

export default connect(mapStateToProps, null, mergeProps);
