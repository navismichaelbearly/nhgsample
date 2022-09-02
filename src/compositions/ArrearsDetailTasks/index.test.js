import React from 'react';
import { shallow } from 'enzyme';
import * as nhhStyles from 'nhh-styles';

import { ArrearsDetailTasksComposition, renderTasks } from './';

import { isUserSeniorManager, compareRoles } from '../../util/userRoles';
import {
  getTaskActivityRouteByActionType,
  getArchivedTasksRoute,
} from '../../constants/internalRoutes';

nhhStyles.formatting.formatDate = jest.fn(() => '10/08/2018 - 8:52pm');

jest.mock('../../constants/internalRoutes');
jest.mock('../TaskCancelModal', () => 'TaskCancelModal');
jest.mock('../TaskCloseModal', () => 'TaskCloseModal');
jest.mock('../TaskReassignModal', () => 'TaskReassignModal');
jest.mock('../../util/userRoles');

const props = {
  arrearsId: 'this-is-an-arrears-id',
  getArrearTasks: jest.fn(),
  invalidateTasks: jest.fn(),
  theme: {
    colors: {
      secondaryLight: 'grey',
      support: { two: 'red', one: 'blue', six: 'yellow' },
    },
  },
  isLoading: false,
  heading: 'Open Tasks ({count})',
  labels: {
    dueDate: 'Due by',
    doDate: 'Do on',
    owner: 'Owner',
    created: 'Created',
    viewOtherTasks: 'View closed and cancelled tasks',
    taskCompleteButton: 'Task Complete',
    taskReassignButton: 'Reassign',
    taskCancelButton: 'Cancel',
    overdue: 'Overdue!',
    reason: 'Reason for {reason}',
    reasons: {
      completion: 'complete this',
      cancellation: 'cancellation',
      reassignment: 'reassignment',
    },
    task09Title: 'Task09',
  },
  archived: false,
  archivedTasksLabels: {
    breadcrumbs: 'Closed and cancelled tasks',
    heading: 'Closed and cancelled tasks ({count})',
    reasons: 'Reasons for closing',
    completed: 'Completed',
    cancelled: 'Cancelled',
  },
  canCreateLegalReferral: true,
  openTaskModal: jest.fn(),
  tasks: [
    {
      actionType: null,
      id: 'foo',
      type: 'manual',
      status: 'Open',
      title: 'this is a title',
      dueDate: '2018-08-27T15:08:44+00:00',
      owner: {
        id: '9e0dca1e-0538-e811-80c9-005056825b41',
        name: 'DynamicsAATest Test',
        type: 'systemusers',
        roles: ['Manager'],
      },
      raisedBy: {
        name: 'Frank',
      },
      createdOn: '2018-08-20T15:08:44+00:00',
      regardingObjectModel: { id: 'bar', type: 'Arrears' },
      isTaskMandatory: false,
    },
  ],
  user: {
    profile: { id: 'myuserid' },
    roles: ['SeniorManager'],
  },
};

const systemGeneratedTasks = [
  {
    actionType: 'addinteraction',
    id: 'foo',
    type: 'system',
    status: 'Open',
    title: 'this is a title',
    dueDate: '2018-08-27T15:08:44+00:00',
    owner: {
      id: '9e0dca1e-0538-e811-80c9-005056825b41',
      name: 'DynamicsAATest Test',
      type: 'systemusers',
    },
    raisedBy: {
      name: 'Frank',
    },
    createdOn: '2018-08-20T15:08:44+00:00',
    regardingObjectModel: { id: 'bar', type: 'Arrears' },
  },
  {
    actionType: 'legalreferral',
    id: 'foo',
    type: 'system',
    status: 'Open',
    title: 'this is a title',
    dueDate: '2018-08-27T15:08:44+00:00',
    owner: {
      id: '9e0dca1e-0538-e811-80c9-005056825b41',
      name: 'DynamicsAATest Test',
      type: 'systemusers',
    },
    raisedBy: {
      name: 'Frank',
    },
    createdOn: '2018-08-20T15:08:44+00:00',
    regardingObjectModel: { id: 'bar', type: 'Arrears' },
  },
];

const archivedTasks = [
  {
    actionType: 'addinteraction',
    id: 'foo',
    type: 'system',
    status: 'Completed',
    title: 'this is a title',
    dueDate: '2018-08-27T15:08:44+00:00',
    owner: {
      id: '9e0dca1e-0538-e811-80c9-005056825b41',
      name: 'DynamicsAATest Test',
      type: 'systemusers',
    },
    raisedBy: {
      name: 'Frank',
    },
    createdOn: '2018-08-20T15:08:44+00:00',
    regardingObjectModel: { id: 'bar', type: 'Arrears' },
  },
  {
    actionType: null,
    id: 'bar',
    type: 'manual',
    status: 'Canceled',
    title: 'this is another title',
    dueDate: '2018-08-27T15:08:44+00:00',
    owner: {
      id: '9e0dca1e-0538-e811-80c9-005056825b41',
      name: 'DynamicsAATest Test',
      type: 'systemusers',
    },
    raisedBy: {
      name: 'Frank',
    },
    createdOn: '2018-08-20T15:08:44+00:00',
    regardingObjectModel: { id: 'bar', type: 'Arrears' },
  },
];

describe('<ArrearsDetailTasksComposition />', () => {
  let el;

  beforeEach(() => {
    getTaskActivityRouteByActionType.mockReturnValue('myLinkSample');
    getArchivedTasksRoute.mockReturnValue('/arrears-details/this-is-an-arrears-id/archived-tasks');
    isUserSeniorManager.mockReturnValue(true);
    el = shallow(<ArrearsDetailTasksComposition {...props} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  describe('renderTasks function', () => {
    const Comp = renderTasks(props);
    let wrapper;
    beforeEach(() => {
      wrapper = shallow(<Comp items={props.tasks} />);
    });
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the page correctly with the task title as a link', () => {
      wrapper.setProps({ items: systemGeneratedTasks });
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the page correctly with the task title as a link for Legal Referral', () => {
      wrapper.setProps({
        items: systemGeneratedTasks,
        canCreateLegalReferral: true,
        legalReferralActionStatus: undefined,
        legalReferralId: undefined,
      });
      wrapper.update();
      expect(wrapper).toMatchSnapshot();
    });

    it('should call openTaskModal with the correct element when task complete is clicked on', () => {
      const taskCompleteButton = wrapper
        .find(nhhStyles.Button)
        .findWhere(n => n.text() === props.labels.taskCompleteButton)
        .parent();

      taskCompleteButton.props().onClick();
      expect(props.openTaskModal).toHaveBeenCalled();
      expect(props.openTaskModal.mock.calls[0][0]).toHaveProperty('type', 'TaskCloseModal');
    });

    it('should call openTaskModal with the correct element when task cancel is clicked on', () => {
      const taskCancelButton = wrapper
        .find(nhhStyles.Button)
        .findWhere(n => n.text() === props.labels.taskCancelButton)
        .parent();
      taskCancelButton.props().onClick();
      expect(props.openTaskModal).toHaveBeenCalled();
      expect(props.openTaskModal.mock.calls[0][0]).toHaveProperty('type', 'TaskCancelModal');
    });

    it('should call openTaskModal with the correct element when task reassign is clicked on', () => {
      const taskReassignButton = wrapper
        .find(nhhStyles.Button)
        .findWhere(n => n.text() === props.labels.taskReassignButton)
        .parent();
      taskReassignButton.props().onClick();
      expect(props.openTaskModal).toHaveBeenCalled();
      expect(props.openTaskModal.mock.calls[0][0]).toHaveProperty('type', 'TaskReassignModal');
    });

    it('Should render correctly in archived mode', () => {
      const ArchivedComp = renderTasks({ ...props, archived: true });
      expect(shallow(<ArchivedComp items={archivedTasks} />)).toMatchSnapshot();
    });

    it("Should hide action buttons when user isn't SeniorManager, task owner nor role >= owner.role", () => {
      isUserSeniorManager.mockReturnValue(false);
      compareRoles.mockReturnValue(false);
      const ArchivedComp = renderTasks({
        ...props,
        user: {
          profile: { id: 'myuserid' },
          roles: ['StandardUser'],
        },
      });
      expect(shallow(<ArchivedComp items={props.tasks} />)).toMatchSnapshot();
      expect(compareRoles).toHaveBeenCalledWith(['StandardUser'], ['Manager']);
    });

    it("Should show action buttons when user isn't SeniorManager nor task owner but is role >= owner.role", () => {
      isUserSeniorManager.mockReturnValue(false);
      compareRoles.mockReturnValue(true);
      const ArchivedComp = renderTasks({
        ...props,
        user: {
          profile: { id: 'myuserid' },
          roles: ['Manager'],
        },
      });
      expect(shallow(<ArchivedComp items={props.tasks} />)).toMatchSnapshot();
      expect(compareRoles).toHaveBeenCalledWith(['Manager'], ['Manager']);
    });

    it("Should show action buttons when user isn't SeniorManager, but is task owner", () => {
      compareRoles.mockReturnValue(false);
      const ArchivedComp = renderTasks({
        ...props,
        user: {
          profile: { id: '9e0dca1e-0538-e811-80c9-005056825b41' },
          roles: ['Manager'],
        },
      });
      expect(shallow(<ArchivedComp items={props.tasks} />)).toMatchSnapshot();
      expect(compareRoles).not.toHaveBeenCalled();
    });

    it('Should show action buttons when user is SeniorManager', () => {
      isUserSeniorManager.mockReturnValue(true);
      compareRoles.mockReturnValue(false);
      const ArchivedComp = renderTasks({
        ...props,
        user: {
          profile: { id: 'nottaskowner' },
          roles: ['SeniorManager'],
        },
      });
      expect(shallow(<ArchivedComp items={props.tasks} />)).toMatchSnapshot();
      expect(compareRoles).not.toHaveBeenCalled();
    });
  });

  it('should render the page correctly while tasks is being populated', () => {
    el.setProps({ tasks: [] });
    expect(el).toMatchSnapshot();
  });

  it('should call getArrearTasks on Mount', () => {
    expect(props.getArrearTasks).toHaveBeenCalled();
  });

  it('should call invalidateTasks on UnMount', () => {
    el.unmount();
    expect(props.invalidateTasks).toHaveBeenCalled();
  });

  describe('reasons', () => {
    it('should render correctly when task has been re-assigned', () => {
      el.setProps({
        tasks: [
          {
            ...props.tasks[0],
            cancellationReason: 'this is bad',
          },
        ],
      });
      expect(el).toMatchSnapshot();
    });

    it('should render correctly when task has been completed', () => {
      el.setProps({
        tasks: [
          {
            ...props.tasks[0],
            completionReason: 'this has been completed',
          },
        ],
      });
      expect(el).toMatchSnapshot();
    });

    it('should render correctly when task has been cancelled', () => {
      el.setProps({
        tasks: [
          {
            ...props.tasks[0],
            completionReason: 'this has been cancelled',
          },
        ],
      });
      expect(el).toMatchSnapshot();
    });
  });
});
