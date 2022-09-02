import { connect } from 'react-redux';

import {
  getStatuses as getArrearStatuses,
  updateFiltersAndFetchResults,
} from '../../ducks/arrears';
import {
  getTasksSummary,
  getStatuses as getTaskStatuses,
  getMyTasksStats,
  getUserTasksSummary,
  getSummaryTasks,
} from '../../ducks/tasks';
import getHelpers from '../../util/stateHelpers';
import { sortPatchList, flattenPatches, flattenUsers } from '../../util/patch';

export const mapStateToProps = state => {
  const { get, getString } = getHelpers(state);

  const profile = get(['user', 'profile']);

  return {
    taskStatuses: get(['tasks', 'statuses']),
    arrearStatuses: get(['arrears', 'statuses']),
    arrearsDashboardLabels: getString(['arrearsDashboard']),
    filterLabels: get(['dictionary', 'arrearsDashboard', 'filters']),
    heading: getString(['arrearsDashboard', 'heading']),
    loadingArrears: get(['arrears', 'loadingArrears']),
    loadingTasks: get(['tasks', 'loading']),
    patches: sortPatchList(get(['patch', 'patchList']), profile),
    myTasks: get(['tasks', 'mySummaryItems']),
    myTasksStats: get(['tasks', 'myTasksStats']),
    mySummaryItemsCount: get(['tasks', 'mySummaryItems', 'count'], 0),
    selectedUserTasksCount: get(['tasks', 'userItemsCount'], 0),
    profile,
    youText: get(['patchList', 'you']),
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
  const flattedUsers = flattenUsers(patches)
    ? flattenUsers(patches)
        .split(',')
        .filter(e => e !== profile.id)
    : [];
  const params = {
    owners: flattedUsers.toString(),
    statuses: 'open',
    EntityType: 'Arrears',
    pageSize: 6,
  };
  const flattenPatchesValues = flattenPatches(patches);
  return {
    ...stateProps,
    patches,
    profile,
    getArrearsSummary: (opts, item) => {
      dispatch(updateFiltersAndFetchResults({ patches: flattenPatchesValues, ...opts }, item));
    },
    getArrearStatuses: opts => {
      dispatch(getArrearStatuses({ patches: flattenPatchesValues, ...opts }));
    },
    getTaskStatuses: opts =>
      dispatch(getTaskStatuses({ patches: flattenPatchesValues, EntityType: 'Arrears', ...opts })),
    getSummaryTasks: opts => {
      dispatch(getSummaryTasks({ patches: flattenPatchesValues, EntityType: 'Arrears', ...opts }));
    },
    getMyTasksStats: opts => {
      dispatch(getMyTasksStats({ EntityType: 'Arrears', ...opts }));
    },
    getMyTasksSummary: () => getSummary({ userId: profile.id }),
    getSelectedUserTasks: () => {
      dispatch(getUserTasksSummary({ ...params }));
    },
    getTasksSummary: (opts = {}, isMine) => {
      getSummary({ patches: flattenPatchesValues, ...opts }, isMine);
    },
    ...ownProps,
  };
};

export default connect(mapStateToProps, null, mergeProps);
