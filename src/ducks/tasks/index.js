import clone from 'ramda/src/clone';
import { tasksApi, tasksApiV2, identityApi } from '../../api';
import objectWithoutNullProperties from '../../util/objectWithoutNullProperties';
import getHelpers from '../../util/stateHelpers';
import { sortPatchList } from '../../util/patch';
// Actions
export const CLEAR_TASK_ACTION_ERROR = 'tasks/CLEAR_TASK_ACTION_ERROR';
export const GETTING_TASKS = 'tasks/GETTING_TASKS';
export const SET_TASKS = 'tasks/SET_TASKS';
export const SET_MY_TASKS_STATS = 'tasks/SET_MY_TASKS_STATS';
export const ADDING_TASK = 'tasks/ADDING_TASK';
export const CLEAR_TASK_ERROR = 'tasks/CLEAR_TASK_ERROR';
export const TASK_ACTION_ERROR = 'tasks/TASK_ACTION_ERROR';
export const TASK_ACTION_SUCCESS = 'tasks/TASK_ACTION_SUCCESS';
export const TASK_ADDED = 'tasks/TASK_ADDED';
export const TASK_ERROR = 'tasks/TASK_ERROR';
export const SET_STATUSES = 'tasks/SET_STATUSES';
export const SET_SUMMARY_TASKS = 'tasks/SET_SUMMARY_TASKS';
export const APPEND_SUMMARY_TASKS = 'tasks/APPEND_SUMMARY_TASKS';
export const SET_MY_SUMMARY_TASKS = 'tasks/SET_MY_SUMMARY_TASKS';
export const APPEND_MY_SUMMARY_TASKS = 'tasks/APPEND_MY_SUMMARY_TASKS';
export const SET_SELECTED_USER_TASKS = 'tasks/SET_SELECTED_USER_TASKS';
export const APPEND_SELECTED_USERS_TASKS = 'tasks/APPEND_SELECTED_USERS_TASKS';
export const VIEW_MORE_TASKS = 'tasks/VIEW_MORE_TASKS';

const initialState = {
  loading: false,
  statuses: {},
  summaryItems: [],
  myTasksStats: {},
  mySummaryItems: [],
  userItems: [],
  userItemsCount: 0,
  patchItems: [],
  patchItemsCount: 0,
  items: [],
  mySummaryItemsCount: 0,
  myTasksCount: 0,
  mySummaryLoading: false,
  myTasksLoading: false,
  modalActionError: false,
  error: false,
  viewMoreLoading: false,
};

const {
  patchTaskStatus,
  patchTaskOwner,
  getMyTasksStats: getMyTasksStatsApi,
  getStatuses: getTasksStatuses,
  getTasks: getTasksApi,
} = tasksApi;

const { getTasksSummary: getTasksSummaryApi } = tasksApiV2;

// Reducers
export default function reducer(state = initialState, { type, isFormError, payload }) {
  switch (type) {
    case CLEAR_TASK_ACTION_ERROR: {
      return {
        ...state,
        modalActionError: false,
        loading: false,
      };
    }
    case VIEW_MORE_TASKS:
      return {
        ...state,
        viewMoreLoading: true,
      };
    case GETTING_TASKS: {
      return {
        ...state,
        loading: true,
      };
    }
    case SET_SELECTED_USER_TASKS: {
      return {
        ...state,
        userItems: payload,
        userItemsCount: payload.count,
        loading: false,
        viewMoreLoading: false,
      };
    }

    case APPEND_SELECTED_USERS_TASKS: {
      const userItemsTemp = {
        items: [...state.userItems.items, ...payload.items],
        count: payload.count,
      };
      return {
        ...state,
        userItems: userItemsTemp,
        userItemsCount: userItemsTemp.count,
        loading: false,
        viewMoreLoading: false,
      };
    }

    case SET_TASKS: {
      return {
        ...state,
        items: payload,
        loading: false,
      };
    }

    case SET_MY_TASKS_STATS: {
      const statusesObject = payload.reduce((acc, curr) => {
        acc[curr.type] = acc[curr.type] || {};
        acc[curr.type][curr.status] = { count: curr.count };
        return acc;
      }, {});

      return {
        ...state,
        myTasksStats: statusesObject,
      };
    }

    case SET_STATUSES: {
      const statusesObject = payload.reduce((acc, curr) => {
        acc[curr.type] = acc[curr.type] || {};
        acc[curr.type][curr.status] = { count: curr.count };
        return acc;
      }, {});

      return {
        ...state,
        statuses: statusesObject,
      };
    }

    case SET_SUMMARY_TASKS:
      return {
        ...state,
        summaryItems: payload,
        summaryItemsCount: payload.count,
        loading: false,
        viewMoreLoading: false,
      };

    case APPEND_SUMMARY_TASKS: {
      const summaryItemsTemp = {
        items: [...state.summaryItems.items, ...payload.items],
        count: payload.count,
      };
      return {
        ...state,
        summaryItems: summaryItemsTemp,
        summaryItemsCount: summaryItemsTemp.count,
        loading: false,
        viewMoreLoading: false,
      };
    }

    case SET_MY_SUMMARY_TASKS:
      return {
        ...state,
        mySummaryItems: payload,
        mySummaryItemsCount: payload.count,
        loading: false,
        viewMoreLoading: false,
      };

    case APPEND_MY_SUMMARY_TASKS: {
      const mySummaryItemsTemp = {
        items: [...state.mySummaryItems.items, ...payload.items],
        count: payload.count,
      };
      return {
        ...state,
        mySummaryItems: mySummaryItemsTemp,
        mySummaryItemsCount: mySummaryItemsTemp.count,
        loading: false,
        viewMoreLoading: false,
      };
    }

    case ADDING_TASK: {
      return {
        ...state,
        error: false,
        loading: true,
      };
    }

    case CLEAR_TASK_ERROR: {
      return {
        ...state,
        error: false,
        loading: false,
      };
    }

    case TASK_ACTION_ERROR: {
      return {
        ...state,
        modalActionError: true,
        loading: false,
      };
    }

    case TASK_ACTION_SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }

    case TASK_ADDED: {
      return {
        ...state,
        error: false,
        loading: false,
      };
    }

    case TASK_ERROR: {
      return {
        ...state,
        error: true,
        loading: false,
        isFormError,
      };
    }
    default:
      return state;
  }
}

// Dispatches

export const loading = () => ({ type: GETTING_TASKS });

export const viewMoreTasks = () => ({ type: VIEW_MORE_TASKS });

export const appendTasksSummary = tasks => ({
  type: APPEND_MY_SUMMARY_TASKS,
  payload: tasks,
});

export const appendSummaryTasks = tasks => ({
  type: APPEND_SUMMARY_TASKS,
  payload: tasks,
});

export const appendSelectedUsersTasksSummary = tasks => ({
  type: APPEND_SELECTED_USERS_TASKS,
  payload: tasks,
});

export const addingTask = () => ({
  type: ADDING_TASK,
});

export const clearActionErrors = () => ({
  type: CLEAR_TASK_ACTION_ERROR,
});

export const clearTaskError = () => ({
  type: CLEAR_TASK_ERROR,
});

export const setStatuses = payload => ({
  type: SET_STATUSES,
  payload,
});

export const setMySummaryTasks = payload => ({
  type: SET_MY_SUMMARY_TASKS,
  payload,
});

export const setSummaryTasks = payload => ({
  type: SET_SUMMARY_TASKS,
  payload,
});

export const setSelectedUserTasks = payload => ({
  type: SET_SELECTED_USER_TASKS,
  payload,
});

export const setTasks = payload => ({
  type: SET_TASKS,
  payload,
});

export const setMyTasksStats = payload => ({
  type: SET_MY_TASKS_STATS,
  payload,
});

export const taskAdded = () => ({
  type: TASK_ADDED,
});

export const taskActionError = () => ({
  type: TASK_ACTION_ERROR,
});

export const taskActionSuccess = payload => ({
  type: TASK_ACTION_SUCCESS,
  payload,
});

export const taskError = (isFormError = false) => ({
  type: TASK_ERROR,
  isFormError,
});

export const addTask = (arrearsId, title, description, date, owner, raisedBy) => async dispatch => {
  dispatch(clearTaskError());
  dispatch(addingTask());
  try {
    await tasksApi.addTask({
      title,
      description,
      dueTime: date,
      owner,
      raisedBy,
      regardingObject: { type: 'case', id: arrearsId },
    });
    dispatch(taskAdded());
  } catch (error) {
    dispatch(taskError());
    throw new Error(error);
  }
};

export const fetchTaskOwnerRoles = id => identityApi.getEmployeeRoles(id);

export const getTasksSummary = opts => async (dispatch, getState) => {
  if (opts.pageNumber > 1) {
    dispatch(viewMoreTasks());
  } else {
    dispatch(loading());
  }
  const state = getState();
  const { get } = getHelpers(state);
  const userId = get(['user', 'profile', 'id']);
  try {
    let data = [];
    const response = await getTasksSummaryApi({
      ...objectWithoutNullProperties(opts),
      UserId: userId,
      count: 6,
      PageNumber: opts.pageNumber || 1,
    });
    data = response.data;
    data.pageNumber = opts.pageNumber;
    if (data.count === 0) {
      dispatch(setMySummaryTasks([]));
    } else if (opts && opts.pageNumber > 1) {
      dispatch(appendTasksSummary(data));
    } else {
      dispatch(setMySummaryTasks(data));
    }
  } catch (e) {
    dispatch(setMySummaryTasks([]));
  }
};

export const getMyTasksStats = opts => async dispatch => {
  dispatch(loading());
  try {
    const { data } = await getMyTasksStatsApi({ ...opts });
    dispatch(setMyTasksStats(data));
  } catch (e) {
    dispatch(setMyTasksStats([]));
  }
};

export const getTasks = opts => async dispatch => {
  dispatch(loading());
  try {
    let { data } = await getTasksApi({ ...opts });

    let ownersRoles;
    if (
      opts &&
      !opts.skipFetchRoles &&
      opts.EntityType === 'Arrears' &&
      opts.Statuses.includes('Open')
    ) {
      const responsesArray = await Promise.all(
        data.map(item => fetchTaskOwnerRoles(item.owner.id).catch(() => ({ data: {} })))
      );

      // defaulting roles to SeniorManager in case of 404 or even 500
      // so only SeniorManagers can action on it (Story-5124)
      ownersRoles = responsesArray.map(({ data: { roles = [{ value: 'SeniorManager' }] } }) =>
        roles.map(role => role.value)
      );
    } else {
      ownersRoles = data.map(() => ['SeniorManager']);
    }

    data = data.map((item, i) => ({
      ...item,
      owner: {
        ...item.owner,
        roles: ownersRoles[i],
      },
    }));

    dispatch(setTasks(data));
  } catch (e) {
    dispatch(setTasks([]));
  }
};

export const invalidateTasks = () => dispatch => {
  dispatch(setTasks([]));
};

export const invalidateSummaryTasks = () => dispatch => {
  dispatch(setMySummaryTasks([]));
};

export const getStatuses = opts => async dispatch => {
  try {
    const { data } = await getTasksStatuses({
      ...objectWithoutNullProperties(opts),
      EntityType: 'Arrears',
    });
    dispatch(setStatuses(data));
  } catch (e) {
    dispatch(setStatuses([]));
  }
};

export const cancelTask = (taskId, params) => async dispatch => {
  try {
    dispatch(loading());
    await patchTaskStatus(taskId, params);
    dispatch(taskActionSuccess());
  } catch (e) {
    dispatch(taskActionError());
    throw new Error(e);
  }
};

export const closeTask = (taskId, params) => async dispatch => {
  try {
    dispatch(loading());
    await patchTaskStatus(taskId, params);
    dispatch(taskActionSuccess());
  } catch (e) {
    dispatch(taskActionError());
    throw new Error(e);
  }
};

export const reassignTask = (taskId, params) => async dispatch => {
  try {
    dispatch(loading());
    await patchTaskOwner(taskId, params);
    dispatch(taskActionSuccess());
  } catch (e) {
    dispatch(taskActionError());
    throw new Error(e);
  }
};

/*
  method for Tasks - Patches
*/
export const getSummaryTasks = opts => async (dispatch, getState) => {
  if (opts.pageNumber > 1) {
    dispatch(viewMoreTasks());
  } else {
    dispatch(loading());
  }
  try {
    const state = getState();
    const { get } = getHelpers(state);
    const profile = get(['user', 'profile']);
    const patches = clone(sortPatchList(get(['patch', 'patchList']), profile));
    const patchesArg = Object.keys(patches)
      .map(k => {
        return patches[k].patchName;
      })
      .join(',');
    let data = [];
    const response = await getTasksSummaryApi({
      ...objectWithoutNullProperties(opts),
      count: 6,
      Patches: patchesArg,
      PageSize: opts.pageSize || 6,
      PageNumber: opts.pageNumber || 1,
    });
    data = response.data;
    data.pageNumber = opts.pageNumber;
    if (data.count === 0) {
      dispatch(setSummaryTasks([]));
    } else if (opts.pageNumber > 1) {
      dispatch(appendSummaryTasks(data));
    } else {
      dispatch(setSummaryTasks(data));
    }
  } catch (e) {
    dispatch(setSummaryTasks([]));
  }
};

/*
  method for Tasks - Selected Users
*/
export const getUserTasksSummary = params => async dispatch => {
  if (params.pageNumber > 1) {
    dispatch(viewMoreTasks());
  } else {
    dispatch(loading());
  }
  try {
    if (params) {
      // dispatching no results, because API is returning all results when no patches selected.
      if (params.owners === '') {
        dispatch(setSelectedUserTasks([]));
      } else {
        let data = [];
        const response = await getTasksSummaryApi({
          ...objectWithoutNullProperties(params),
          count: 6,
          PageNumber: params.pageNumber || 1,
        });
        data = response.data;
        data.pageNumber = params.pageNumber;
        if (data.count === 0) {
          dispatch(setSelectedUserTasks([]));
        } else if (data.pageNumber === undefined) {
          dispatch(setSelectedUserTasks(data));
        } else {
          dispatch(appendSelectedUsersTasksSummary(data));
        }
      }
    }
  } catch (e) {
    dispatch(taskActionError());
  }
};
