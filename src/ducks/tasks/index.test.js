import reducer, {
  invalidateTasks,
  invalidateSummaryTasks,
  addingTask,
  cancelTask,
  clearActionErrors,
  clearTaskError,
  closeTask,
  reassignTask,
  taskAdded,
  taskActionError,
  taskError,
  addTask,
  getUserTasksSummary,
  getSummaryTasks,
  getTasksSummary,
  getTasks,
  getMyTasksStats,
  ADDING_TASK,
  CLEAR_TASK_ERROR,
  TASK_ADDED,
  TASK_ACTION_SUCCESS,
  TASK_ERROR,
  GETTING_TASKS,
  VIEW_MORE_TASKS,
  SET_TASKS,
  SET_MY_SUMMARY_TASKS,
  APPEND_MY_SUMMARY_TASKS,
  APPEND_SELECTED_USERS_TASKS,
  SET_SUMMARY_TASKS,
  SET_SELECTED_USER_TASKS,
  SET_MY_TASKS_STATS,
  TASK_ACTION_ERROR,
  appendTasksSummary,
  appendSelectedUsersTasksSummary,
  viewMoreTasks,
  setMySummaryTasks,
  setSelectedUserTasks,
  setStatuses,
  setTasks,
  setMyTasksStats,
  setSummaryTasks,
  appendSummaryTasks,
  taskActionSuccess,
  loading,
} from './';
import * as api from '../../api';

jest.mock('uuid/v4', () => () => 'guid');

jest.mock('../../api', () => ({
  identityApi: {
    getEmployeeRoles: jest.fn(id => ({
      data: {
        id,
        roles: [{ value: 'SeniorManager' }],
      },
    })),
  },
  tasksApi: {
    addTask: jest.fn(x => x.title === 'fail' && Promise.reject()),
    getTasks: jest.fn(params => ({
      data: [
        {
          id: 'foo',
          ...params,
        },
      ],
    })),
    getTasksSummary: jest.fn(params => ({
      data: [{ id: 'foo', ...params }],
    })),
    getStatuses: jest.fn(params => ({
      data: [{ id: 'foo', ...params }],
    })),
    getMyTasksStats: jest.fn(params => ({
      data: [{ ...params }],
    })),
    invalidateTasks: jest.fn(),
    invalidateSummaryTasks: jest.fn(),
    patchTaskOwner: jest.fn(),
    patchTaskStatus: jest.fn(),
  },
  tasksApiV2: {
    getTasksSummary: jest.fn(() => ({
      data: [
        {
          count: 15,
          pageNumber: 2,
          items: [
            {
              id: '7116fbd9-d525-41ca-b017-7b34a0959512',
              title: 'Task 1',
              tenantName: 'Joseph Morris',
              status: 'Open',
              owner: {
                id: 'd907cefc-3b45-eb11-80f8-005056825b41',
                name: 'Navis Michael',
                type: 'systemusers',
              },
            },
          ],
        },
      ],
    })),
    getStatuses: jest.fn(params => ({
      data: [{ id: 'foo', ...params, userId: 'abc', owners: 'ijk,xyz' }],
    })),
    getSummaryTasks: jest.fn(() => ({
      data: [
        {
          count: 15,
          pageNumber: 2,
          items: [
            {
              id: '7116fbd9-d525-41ca-b017-7b34a0959512',
              title: 'Task 1',
              tenantName: 'Joseph Morris',
              status: 'Open',
              owner: {
                id: 'd907cefc-3b45-eb11-80f8-005056825b41',
                name: 'Navis Michael',
                type: 'systemusers',
              },
            },
          ],
        },
      ],
    })),
    getUserTasksSummary: jest.fn(() => ({
      data: [
        {
          count: 29,
          pageNumber: 2,
          items: [
            {
              id: '7116fbd9-d525-41ca-b017-7b34a0959512',
              title: 'Task 1',
              tenantName: 'Joseph Morris',
              status: 'Open',
              owner: {
                id: 'd907cefc-3b45-eb11-80f8-005056825b41',
                name: 'Navis Michael',
                type: 'systemusers',
              },
            },
          ],
        },
      ],
    })),
  },
}));

const populatedState = {
  arrears: {
    filters: {
      foo: 'bar',
    },
  },
};

describe('tasks reducer', () => {
  let dispatch;
  let currentState;

  beforeEach(() => {
    currentState = { foo: 'bar' };
    dispatch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses default initial state if no state passed', () => {
    const result = reducer(undefined, {});
    expect(result).toEqual({
      statuses: {},
      summaryItems: [],
      myTasksStats: {},
      mySummaryItems: [],
      items: [],
      error: false,
      modalActionError: false,
      loading: false,
      mySummaryItemsCount: 0,
      mySummaryLoading: false,
      myTasksCount: 0,
      myTasksLoading: false,
      patchItems: [],
      patchItemsCount: 0,
      userItems: [],
      userItemsCount: 0,
      viewMoreLoading: false,
    });
  });

  it('returns untouched state by default', () => {
    const result = reducer(currentState, {});
    expect(result).toEqual(currentState);
  });

  it('generates the correct state for a addingTask action', () => {
    const result = reducer(currentState, addingTask());
    expect(result).toEqual({
      foo: 'bar',
      error: false,
      loading: true,
    });
  });

  it('test to validate the view more tasks', () => {
    const result = reducer(currentState, viewMoreTasks());
    expect(result).toEqual({
      ...currentState,
      viewMoreLoading: true,
    });
  });

  it('test to validate the getting tasks - loading', () => {
    const result = reducer(currentState, loading());
    expect(result).toEqual({
      ...currentState,
      loading: true,
    });
  });

  it('test to validate the set selected users tasks', () => {
    const payload = { count: 2, items: ['Test Item 1', 'Test Item 2'] };
    const action = setSelectedUserTasks(payload);
    const result = reducer(currentState, action);
    expect(result).toEqual({
      ...currentState,
      userItems: action.payload,
      userItemsCount: action.payload.count,
      loading: false,
      viewMoreLoading: false,
    });
  });

  it('test to validate the append selected users tasks summary', () => {
    const payload = { count: 2, items: ['Test Item 1', 'Test Item 2'] };
    const action = appendSelectedUsersTasksSummary(payload);
    const testState = { ...currentState, userItems: { items: ['Test A'] } };
    const result = reducer(testState, action);
    const userItemsTemp = {
      items: [...testState.userItems.items, ...action.payload.items],
      count: action.payload.count,
    };

    expect(result).toEqual({
      ...currentState,
      userItems: userItemsTemp,
      userItemsCount: userItemsTemp.count,
      loading: false,
      viewMoreLoading: false,
    });
  });

  it('test to validate the set tasks', () => {
    const payload = { items: ['Test Item 1', 'Test Item 2'] };
    const action = setTasks(payload);
    const result = reducer(currentState, action);
    expect(result).toEqual({
      ...currentState,
      items: action.payload,
      loading: false,
    });
  });

  it('test to validate the set my tasks stats', () => {
    const payload = [
      { type: 'a', status: true, count: 10 },
      { type: 'b', status: false, count: 11 },
    ];
    const action = setMyTasksStats(payload);
    const statusesObject = action.payload.reduce((acc, curr) => {
      acc[curr.type] = acc[curr.type] || {};
      acc[curr.type][curr.status] = { count: curr.count };
      return acc;
    }, {});
    const result = reducer(currentState, action);
    expect(result).toEqual({
      ...currentState,
      myTasksStats: statusesObject,
    });
  });

  it('test to validate the set set statusus', () => {
    const payload = [
      { type: 'a', status: true, count: 10 },
      { type: 'b', status: false, count: 11 },
    ];
    const action = setStatuses(payload);
    const statusesObject = action.payload.reduce((acc, curr) => {
      acc[curr.type] = acc[curr.type] || {};
      acc[curr.type][curr.status] = { count: curr.count };
      return acc;
    }, {});
    const result = reducer(currentState, action);
    expect(result).toEqual({
      ...currentState,
      statuses: statusesObject,
    });
  });

  it('test to validate the set summary tasks', () => {
    const payload = { count: 2, items: ['Test Item 1', 'Test Item 2'] };
    const action = setSummaryTasks(payload);
    const result = reducer(currentState, action);
    expect(result).toEqual({
      ...currentState,
      summaryItems: action.payload,
      summaryItemsCount: action.payload.count,
      loading: false,
      viewMoreLoading: false,
    });
  });

  it('test to validate append summary tasks', () => {
    const payload = { count: 2, items: ['Test Item 1', 'Test Item 2'] };
    const action = appendSummaryTasks(payload);
    const testState = { ...currentState, summaryItems: { items: ['Test A'] } };
    const result = reducer(testState, action);
    const summaryItemsTemp = {
      items: [...testState.summaryItems.items, ...action.payload.items],
      count: action.payload.count,
    };
    expect(result).toEqual({
      ...currentState,
      summaryItems: summaryItemsTemp,
      summaryItemsCount: summaryItemsTemp.count,
      loading: false,
      viewMoreLoading: false,
    });
  });

  it('test to validate the set my summary tasks', () => {
    const payload = { count: 2, items: ['Test Item 1', 'Test Item 2'] };
    const action = setMySummaryTasks(payload);
    const result = reducer(currentState, action);
    expect(result).toEqual({
      ...currentState,
      mySummaryItems: action.payload,
      mySummaryItemsCount: action.payload.count,
      loading: false,
      viewMoreLoading: false,
    });
  });

  it('test to validate append my summary tasks', () => {
    const payload = { count: 2, items: ['Test Item 1', 'Test Item 2'] };
    const action = appendTasksSummary(payload);
    const testState = { ...currentState, mySummaryItems: { items: ['Test A'] } };
    const result = reducer(testState, action);
    const mySummaryItemsTemp = {
      items: [...testState.mySummaryItems.items, ...action.payload.items],
      count: action.payload.count,
    };
    expect(result).toEqual({
      ...currentState,
      mySummaryItems: mySummaryItemsTemp,
      mySummaryItemsCount: mySummaryItemsTemp.count,
      loading: false,
      viewMoreLoading: false,
    });
  });

  it('test to validate task action success', () => {
    const payload = {};
    const action = taskActionSuccess(payload);
    const result = reducer(currentState, action);
    expect(result).toEqual({
      ...currentState,
      loading: false,
    });
  });

  it('generates the correct state for a clearActionErrors action', () => {
    const result = reducer(currentState, clearActionErrors());
    expect(result).toEqual({
      foo: 'bar',
      modalActionError: false,
      loading: false,
    });
  });

  it('generates the correct state for a clear Task Error action', () => {
    const result = reducer(currentState, clearTaskError());
    expect(result).toEqual({
      foo: 'bar',
      error: false,
      loading: false,
    });
  });

  it('generates the correct state for a taskError  action', () => {
    const result = reducer(currentState, taskError());
    expect(result).toEqual({
      foo: 'bar',
      error: true,
      isFormError: false,
      loading: false,
    });
  });

  it('generates the correct state for a taskActionError modalActionError=true action', () => {
    const result = reducer(currentState, taskActionError());
    expect(result).toEqual({
      foo: 'bar',
      modalActionError: true,
      loading: false,
    });
  });

  it('generates the correct state for a taskError isFormError=true action', () => {
    const result = reducer(currentState, taskError(true));
    expect(result).toEqual({
      foo: 'bar',
      error: true,
      isFormError: true,
      loading: false,
    });
  });

  it('generates the correct state for a taskAdded action', () => {
    const result = reducer(currentState, taskAdded());
    expect(result).toEqual({
      foo: 'bar',
      error: false,
      loading: false,
    });
  });

  it('performs the appendSelectedUsersTasksSummary', async () => {
    await appendSelectedUsersTasksSummary({ pageNumber: 2 });
  });

  it('performs the appendTasksSummary', async () => {
    await appendTasksSummary({ pageNumber: 2 });
  });

  it('performs the getTasksSummary error', async () => {
    await setMySummaryTasks([]);
  });

  it('performs the correct actions for addTask', async () => {
    const arrearsId = 'ARREARS_ID';
    const title = 'TITLE';
    const description = 'DESCRIPTION';
    const date = 'DATE';
    const owner = 'OWNER';
    const raisedBy = 'RAISEDBY';

    await addTask(arrearsId, title, description, date, owner, raisedBy)(dispatch);

    expect(dispatch).toBeCalledWith({ type: CLEAR_TASK_ERROR });
    expect(dispatch).toBeCalledWith({ type: ADDING_TASK });
    expect(api.tasksApi.addTask).toBeCalledWith({
      title,
      description,
      dueTime: date,
      owner,
      raisedBy,
      regardingObject: { type: 'case', id: arrearsId },
    });
    expect(dispatch).toBeCalledWith({ type: TASK_ADDED });
  });

  it('performs the correct actions for addTask when an error is thrown', async () => {
    expect.assertions(1);
    await addTask(
      null,
      'fail'
    )(dispatch).catch(() => {
      expect(dispatch).toBeCalledWith({ type: TASK_ERROR, isFormError: false });
    });
  });

  it('performs the correct actions for cancelTask when an error is thrown', async () => {
    await cancelTask(
      null,
      'fail'
    )(dispatch).catch(() => {
      expect(dispatch).toBeCalledWith({ type: TASK_ACTION_ERROR, isFormError: false });
    });
  });

  it('performs the correct actions for closeTask when an error is thrown', async () => {
    await closeTask(
      null,
      'fail'
    )(dispatch).catch(() => {
      expect(dispatch).toBeCalledWith({ type: TASK_ACTION_ERROR, isFormError: false });
    });
  });

  it('performs the correct actions for reassign when an error is thrown', async () => {
    await reassignTask(
      null,
      'fail'
    )(dispatch).catch(() => {
      expect(dispatch).toBeCalledWith({ type: TASK_ACTION_ERROR, isFormError: false });
    });
  });

  it('performs the correct actions to invalidate tasks', async () => {
    invalidateTasks()(dispatch);
    expect(dispatch).toBeCalledWith({
      payload: [],
      type: SET_TASKS,
    });
  });

  it('performs the correct actions to invalidate summary tasks', async () => {
    invalidateSummaryTasks()(dispatch);
    expect(dispatch).toBeCalledWith({
      payload: [],
      type: SET_MY_SUMMARY_TASKS,
    });
  });

  it('performs the correct actions for setMySummaryTasks when querying my tasks', async () => {
    await setMySummaryTasks([]);
  });

  it('performs the correct actions for setSelectedUserTasks when querying my tasks', async () => {
    await setSelectedUserTasks([]);
  });

  it('performs the correct actions for setStatuses when querying my tasks', async () => {
    await setStatuses([]);
  });

  it('performs actions for getTasksSummary - Tasks - My Tasks - Page Number 1', async () => {
    const opts = {
      EntityType: 'Arrears',
      Statuses: 'open',
      owner: 'd907cefc-3b45-eb11-80f8-005056825b41',
    };
    await getTasksSummary(opts)(dispatch, () => populatedState);
    expect(dispatch).toBeCalledWith({ type: GETTING_TASKS });
    expect(api.tasksApiV2.getTasksSummary).toBeCalled();
    expect(dispatch).toBeCalledWith({
      payload: [
        {
          count: 15,
          items: [
            {
              id: '7116fbd9-d525-41ca-b017-7b34a0959512',
              owner: {
                id: 'd907cefc-3b45-eb11-80f8-005056825b41',
                name: 'Navis Michael',
                type: 'systemusers',
              },
              status: 'Open',
              tenantName: 'Joseph Morris',
              title: 'Task 1',
            },
          ],
          pageNumber: 2,
        },
      ],
      type: SET_MY_SUMMARY_TASKS,
    });
  });

  it('performs actions for getTasksSummary - Tasks - My Tasks - Page Number 2', async () => {
    const opts = {
      pageNumber: 2,
    };
    await getTasksSummary(opts)(dispatch, () => populatedState);
    expect(dispatch).toBeCalledWith({ type: VIEW_MORE_TASKS });
    expect(api.tasksApiV2.getTasksSummary).toBeCalled();
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]).toEqual([{ type: VIEW_MORE_TASKS }]);
    expect(dispatch.mock.calls[1][0].type).toEqual(APPEND_MY_SUMMARY_TASKS);
  });

  it('performs actions for getSummaryTasks - Tasks - Patches - Catch', async () => {
    const opts = {
      EntityType: 'Arrears',
    };
    await getSummaryTasks(opts)(dispatch, () => populatedState);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]).toEqual([{ type: GETTING_TASKS }]);
    expect(dispatch.mock.calls[1]).toEqual([
      {
        payload: [],
        type: SET_SUMMARY_TASKS,
      },
    ]);
  });

  it('performs actions for getSummaryTasks - Tasks - Patches - Page 1', async () => {
    const opts = {
      EntityType: 'Arrears',
    };
    const localState = {
      patch: {
        patchList: [
          {
            name: 'John Smith',
            patchName: 'Hello world',
          },
          {
            name: 'Jane Smith',
            patchName: 'Some other name',
          },
        ],
      },
      user: {
        profile: {
          id: 'ABC123',
          patchName: 'Hello world',
        },
      },
    };
    await getSummaryTasks(opts)(dispatch, () => localState);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]).toEqual([{ type: GETTING_TASKS }]);
    expect(dispatch.mock.calls[1]).toEqual([
      {
        payload: [
          {
            count: 15,
            items: [
              {
                id: '7116fbd9-d525-41ca-b017-7b34a0959512',
                owner: {
                  id: 'd907cefc-3b45-eb11-80f8-005056825b41',
                  name: 'Navis Michael',
                  type: 'systemusers',
                },
                status: 'Open',
                tenantName: 'Joseph Morris',
                title: 'Task 1',
              },
            ],
            pageNumber: 2,
          },
        ],
        type: SET_SUMMARY_TASKS,
      },
    ]);
  });

  it('performs actions for getSummaryTasks - Tasks - Patches - Page 2', async () => {
    const opts = {
      EntityType: 'Arrears',
      pageNumber: 2,
    };
    const localState = {
      patch: {
        patchList: [
          {
            name: 'John Smith',
            patchName: 'Hello world',
          },
          {
            name: 'Jane Smith',
            patchName: 'Some other name',
          },
        ],
      },
      user: {
        profile: {
          id: 'ABC123',
          patchName: 'Hello world',
        },
      },
    };
    await getSummaryTasks(opts)(dispatch, () => localState);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]).toEqual([{ type: VIEW_MORE_TASKS }]);
  });

  it('performs actions for getUserTasksSummary - Tasks - Selected Users - Page Number 1', async () => {
    const opts = {
      EntityType: 'Arrears',
      owners: '6ee5be56-3c45-eb11-80f8-005056825b41,8be2f7fe-5adc-e811-80d2-005056825b41',
      pageSize: 6,
      statuses: 'open',
    };
    await getUserTasksSummary(opts)(dispatch, () => populatedState);
    expect(dispatch).toBeCalledWith({ type: GETTING_TASKS });
    expect(api.tasksApiV2.getUserTasksSummary);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]).toEqual([{ type: GETTING_TASKS }]);
    expect(dispatch.mock.calls[1]).toEqual([
      {
        payload: [
          {
            count: 15,
            items: [
              {
                id: '7116fbd9-d525-41ca-b017-7b34a0959512',
                owner: {
                  id: 'd907cefc-3b45-eb11-80f8-005056825b41',
                  name: 'Navis Michael',
                  type: 'systemusers',
                },
                status: 'Open',
                tenantName: 'Joseph Morris',
                title: 'Task 1',
              },
            ],
            pageNumber: 2,
          },
        ],
        type: SET_SELECTED_USER_TASKS,
      },
    ]);
  });

  it('performs actions for getUserTasksSummary - Tasks - Selected Users - Page Number 2', async () => {
    const opts = {
      EntityType: 'Arrears',
      owners: '6ee5be56-3c45-eb11-80f8-005056825b41,8be2f7fe-5adc-e811-80d2-005056825b41',
      pageNumber: 2,
      pageSize: 6,
      statuses: 'open',
    };
    await getUserTasksSummary(opts)(dispatch, () => populatedState);
    expect(dispatch).toBeCalledWith({ type: VIEW_MORE_TASKS });
    expect(api.tasksApiV2.getUserTasksSummary);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]).toEqual([{ type: VIEW_MORE_TASKS }]);
    expect(dispatch.mock.calls[1][0].type).toEqual(APPEND_SELECTED_USERS_TASKS);
  });

  it('performs actions for getUserTasksSummary - Tasks - Selected Users - empty input ', async () => {
    const opts = {
      EntityType: 'Arrears',
      owners: '',
      pageSize: 6,
      statuses: 'open',
    };
    await getUserTasksSummary(opts)(dispatch, () => populatedState);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0]).toEqual([{ type: GETTING_TASKS }]);
    expect(dispatch.mock.calls[1][0].type).toEqual(SET_SELECTED_USER_TASKS);
  });

  it('performs the correct actions for getMyTasksStats', async () => {
    await getMyTasksStats()(dispatch);
    expect(api.tasksApi.getMyTasksStats).toBeCalled();
    expect(dispatch).toBeCalledWith({
      payload: [{}],
      type: SET_MY_TASKS_STATS,
    });
  });

  it('performs the correct actions for EntityType Arreras and Statuses Open getTasks', async () => {
    api.identityApi.getEmployeeRoles = jest.fn(() =>
      Promise.resolve({
        data: { roles: [{ value: 'SeniorManager' }] },
      })
    );
    const opts = {
      EntityType: 'Arrears',
      Statuses: ['Open'],
      owner: { id: 'fooid' },
    };
    await getTasks(opts)(dispatch);
    expect(dispatch).toBeCalledWith({ type: GETTING_TASKS });
    expect(api.tasksApi.getTasks).toBeCalled();
    expect(api.identityApi.getEmployeeRoles).toBeCalledWith('fooid');
    expect(dispatch).toBeCalledWith({
      payload: [
        {
          ...opts,
          id: 'foo',
          owner: {
            id: 'fooid',
            roles: ['SeniorManager'],
          },
        },
      ],
      type: SET_TASKS,
    });
  });

  it('getTasks returns empty array when user roles=[]', async () => {
    api.identityApi.getEmployeeRoles = jest.fn(() =>
      Promise.resolve({
        data: { roles: [] },
      })
    );
    const opts = {
      EntityType: 'Arrears',
      Statuses: ['Open'],
      owner: { id: 'fooid' },
    };
    await getTasks(opts)(dispatch);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith({ type: GETTING_TASKS });
    expect(api.tasksApi.getTasks).toHaveBeenCalledTimes(1);
    expect(api.tasksApi.getTasks).toHaveBeenCalledWith(opts);
    expect(api.identityApi.getEmployeeRoles).toHaveBeenCalledTimes(1);
    expect(api.identityApi.getEmployeeRoles).toHaveBeenCalledWith('fooid');
    expect(dispatch).toHaveBeenCalledWith({
      payload: [
        {
          ...opts,
          id: 'foo',
          owner: {
            id: 'fooid',
            roles: [],
          },
        },
      ],
      type: SET_TASKS,
    });
  });

  it('performs the correct actions for skipFetchRoles getTasks', async () => {
    const opts = {
      EntityType: 'Arrears',
      Statuses: ['Open'],
      owner: { id: 'fooid' },
      skipFetchRoles: true,
    };
    await getTasks(opts)(dispatch);
    expect(dispatch).toBeCalledWith({ type: GETTING_TASKS });
    expect(api.tasksApi.getTasks).toBeCalled();
    expect(api.identityApi.getEmployeeRoles).not.toBeCalled();
    expect(dispatch).toBeCalledWith({
      payload: [
        {
          ...opts,
          id: 'foo',
          owner: {
            id: 'fooid',
            roles: ['SeniorManager'],
          },
        },
      ],
      type: SET_TASKS,
    });
  });

  it('assumes taskowner is SeniorManager when fetch roles fail', async () => {
    api.identityApi.getEmployeeRoles = jest.fn(() => Promise.reject({ error: 'fail' }));
    const opts = {
      EntityType: 'Arrears',
      Statuses: ['Open'],
      owner: { id: 'fooid' },
    };
    await getTasks(opts)(dispatch);
    expect(dispatch).toBeCalledWith({ type: GETTING_TASKS });
    expect(api.tasksApi.getTasks).toBeCalled();
    expect(api.identityApi.getEmployeeRoles).toBeCalledWith('fooid');
    expect(dispatch).toBeCalledWith({
      payload: [
        {
          ...opts,
          id: 'foo',
          owner: {
            id: 'fooid',
            roles: ['SeniorManager'],
          },
        },
      ],
      type: SET_TASKS,
    });
  });

  it('performs the correct actions for cancelTask', async () => {
    const taskId = 'taskID';
    const params = {};
    await cancelTask(taskId, params)(dispatch);
    expect(api.tasksApi.patchTaskStatus).toBeCalledWith(taskId, params);
    expect(dispatch).toBeCalledWith({ type: TASK_ACTION_SUCCESS });
  });

  it('performs the correct actions for closeTask', async () => {
    const taskId = 'taskID';
    const params = {};
    await closeTask(taskId, params)(dispatch);
    expect(api.tasksApi.patchTaskStatus).toBeCalledWith(taskId, params);
    expect(dispatch).toBeCalledWith({ type: TASK_ACTION_SUCCESS });
  });

  it('performs the correct actions for reassignTask', async () => {
    const taskId = 'taskID';
    const params = {};
    await reassignTask(taskId, params)(dispatch);
    expect(api.tasksApi.patchTaskOwner).toBeCalledWith(taskId, params);
    expect(dispatch).toBeCalledWith({ type: TASK_ACTION_SUCCESS });
  });
});
