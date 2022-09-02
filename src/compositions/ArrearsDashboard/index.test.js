import React from 'react';
import { shallow } from 'enzyme';

import { ArrearsDashboardComposition } from './';
import TasksSummaryCards from '../../components/TasksSummaryCards';

import { TASKS_SEL, MY_TASKS_SEL, USER_TASKS_SEL } from '../../constants/dropdownValues';

describe('<ArrearsDashboardComposition />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      cardLabels: {
        address: 'Address',
        currentBalance: 'Current balance',
        heading: 'Arrears',
        notificationDate: 'Notification date',
        openTasks: 'Open tasks',
        tenantName: 'Tenant name',
      },
      taskCardLabels: {
        heading: 'Tasks',
        dueDate: 'Due Date',
        taskOwner: 'Task Owner',
        title: 'Title',
        customerName: 'Customer Name',
        address: 'Address',
        status: 'Status',
        overdue: 'overdue!',
      },
      arrears: [],
      tasks: [],
      myTasks: [],
      arrearsNoDataMsg: 'Gotham is in danger',
      myTasksNoDataMsg: 'My Gotham is in danger',
      tasksNoDataMsg: 'Gotham is in danger',
      heading: 'titleText',
      updatePageHeader: jest.fn(),
      getTasksSummary: jest.fn(),
      getArrearStatuses: jest.fn(),
      getTaskStatuses: jest.fn(),
      getSelectedUserTasks: jest.fn(),
      getSummaryTasks: jest.fn(),
      arrearStatuses: {},
      taskStatuses: {},
      loadingArrears: false,
      loadingTasks: false,
      profile: {
        id: 'ABC123',
        patchName: 'Hello world',
      },
      patches: [
        {
          name: 'John Smith',
          patchName: 'Hello world',
        },
        {
          name: 'Jane Smith',
          patchName: 'Some other name',
        },
      ],
      getMyTasksSummary: jest.fn(),
      getArrearsSummary: jest.fn(),
      onOpenPatchSelect: jest.fn(),
      invalidateTasks: jest.fn(),
      getUserTasksSummary: jest.fn(),
      getStatuses: jest.fn(),
      selectedUserTasks: [],
      selectedUserTasksNoDataMsg: '',
      viewMoreLoading: false,
    };

    el = shallow(<ArrearsDashboardComposition {...props} />);
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('selected user tasks with more result count', () => {
    el.setState({ statusFilterId: USER_TASKS_SEL });
    el.setProps({
      selectedUserTasksCount: 16,
      selectedUserTasks: {
        count: 16,
        items: [
          {
            id: 'd710fe3a-7142-481a-be10-0c0ba5e55dfa',
            type: 'manual',
            status: 'Open',
            title: 'Task 10 title',
            dueDate: '2021-01-21T18:30:00+00:00',
            assetName: 'abc',
            tenantName: 'xyz',
          },
          {
            id: '69b8964e-53ad-4d07-9e25-160caf52f3e6',
            type: 'manual',
            status: 'Open',
            title: 'Task 8',
            dueDate: '2021-01-21T18:30:00+00:00',
            assetName: 'abc',
            tenantName: 'xyz',
          },
          {
            id: '8ec08b38-cd64-4d3f-93bd-254afb8dd71e',
            type: 'manual',
            status: 'Open',
            title: 'Task 2',
            dueDate: '2021-01-21T18:30:00+00:00',
            assetName: 'abc',
            tenantName: 'xyz',
          },
          {
            id: 'ec433738-235f-40b5-8472-2623dafdc7b3',
            type: 'manual',
            status: 'Open',
            title: 'Task 4',
            dueDate: '2021-01-21T18:30:00+00:00',
            assetName: 'abc',
            tenantName: 'xyz',
          },
          {
            id: 'c18968ff-5ed6-4bc1-bd49-4ec9785c2767',
            type: 'manual',
            status: 'Open',
            title: 'Task 5',
            dueDate: '2021-01-28T18:30:00+00:00',
            assetName: 'abc',
            tenantName: 'xyz',
          },
          {
            id: 'f2f5b601-06a6-4439-ac64-797a058ef063',
            type: 'manual',
            status: 'Open',
            title: 'Tap Repair',
            dueDate: '2021-02-24T18:30:00+00:00',
            assetName: 'abc',
            tenantName: 'xyz',
          },
        ],
      },
    }).update();
    expect(el).toMatchSnapshot();
  });

  it('my tasks user tasks with more result count', () => {
    el.setState({ statusFilterId: MY_TASKS_SEL });
    el.setProps({
      myTasks: [
        {
          id: 'd710fe3a-7142-481a-be10-0c0ba5e55dfa',
          type: 'manual',
          status: 'Open',
          title: 'Task 10 title',
          dueDate: '2021-01-21T18:30:00+00:00',
          assetName: 'abc',
          tenantName: 'xyz',
        },
        {
          id: '69b8964e-53ad-4d07-9e25-160caf52f3e6',
          type: 'manual',
          status: 'Open',
          title: 'Task 8',
          dueDate: '2021-01-21T18:30:00+00:00',
          assetName: 'abc',
          tenantName: 'xyz',
        },
        {
          id: '8ec08b38-cd64-4d3f-93bd-254afb8dd71e',
          type: 'manual',
          status: 'Open',
          title: 'Task 2',
          dueDate: '2021-01-21T18:30:00+00:00',
          assetName: 'abc',
          tenantName: 'xyz',
        },
        {
          id: 'ec433738-235f-40b5-8472-2623dafdc7b3',
          type: 'manual',
          status: 'Open',
          title: 'Task 4',
          dueDate: '2021-01-21T18:30:00+00:00',
          assetName: 'abc',
          tenantName: 'xyz',
        },
        {
          id: 'c18968ff-5ed6-4bc1-bd49-4ec9785c2767',
          type: 'manual',
          status: 'Open',
          title: 'Task 5',
          dueDate: '2021-01-28T18:30:00+00:00',
          assetName: 'abc',
          tenantName: 'xyz',
        },
        {
          id: 'f2f5b601-06a6-4439-ac64-797a058ef063',
          type: 'manual',
          status: 'Open',
          title: 'Tap Repair',
          dueDate: '2021-02-24T18:30:00+00:00',
          assetName: 'abc',
          tenantName: 'xyz',
        },
      ],
    }).update();
    expect(el).toMatchSnapshot();
  });

  it('tasks patches with more result count', () => {
    el.setState({ statusFilterId: TASKS_SEL });
    el.setProps({
      tasks: [
        {
          id: 'd710fe3a-7142-481a-be10-0c0ba5e55dfa',
          type: 'manual',
          status: 'Open',
          title: 'Task 10 title',
          dueDate: '2021-01-21T18:30:00+00:00',
          assetName: 'abc',
          tenantName: 'xyz',
        },
        {
          id: '69b8964e-53ad-4d07-9e25-160caf52f3e6',
          type: 'manual',
          status: 'Open',
          title: 'Task 8',
          dueDate: '2021-01-21T18:30:00+00:00',
          assetName: 'abc',
          tenantName: 'xyz',
        },
        {
          id: '8ec08b38-cd64-4d3f-93bd-254afb8dd71e',
          type: 'manual',
          status: 'Open',
          title: 'Task 2',
          dueDate: '2021-01-21T18:30:00+00:00',
          assetName: 'abc',
          tenantName: 'xyz',
        },
        {
          id: 'ec433738-235f-40b5-8472-2623dafdc7b3',
          type: 'manual',
          status: 'Open',
          title: 'Task 4',
          dueDate: '2021-01-21T18:30:00+00:00',
          assetName: 'abc',
          tenantName: 'xyz',
        },
        {
          id: 'c18968ff-5ed6-4bc1-bd49-4ec9785c2767',
          type: 'manual',
          status: 'Open',
          title: 'Task 5',
          dueDate: '2021-01-28T18:30:00+00:00',
          assetName: 'abc',
          tenantName: 'xyz',
        },
        {
          id: 'f2f5b601-06a6-4439-ac64-797a058ef063',
          type: 'manual',
          status: 'Open',
          title: 'Tap Repair',
          dueDate: '2021-02-24T18:30:00+00:00',
          assetName: 'abc',
          tenantName: 'xyz',
        },
      ],
    }).update();
    expect(el).toMatchSnapshot();
  });

  it('arrears list validation', () => {
    el.setState({ statusFilterId: null });
    el.setProps({
      filterLabel: 'Arrears - System Paused (50)',
      resultCount: 6,
      arrears: [
        {
          createdOn: '2021-02-15T16:13:48+00:00',
          currentBalance: 0,
          daysInArrears: 16,
          id: 'abc1',
          lastModified: '2021-03-03T07:23:43+00:00',
          openTaskCount: 1,
          ownerOutputModel: {
            id: 'xyz1',
            name: 'Eileen O Neill',
            type: 'systemuser',
          },
          priority: 54361,
          status: 'System Paused',
          tenancy: {
            address: 'Flat 3 313 Harrow Road, London, 3RJ',
            id: 1,
            name: 'Dummy Pommells',
          },
          title: 'Arrears - 50101743',
        },
        {
          createdOn: '2021-02-15T16:13:48+00:00',
          currentBalance: 0,
          daysInArrears: 16,
          id: 'abc2',
          lastModified: '2021-03-03T07:23:43+00:00',
          openTaskCount: 1,
          ownerOutputModel: {
            id: 'xyz2',
            name: 'Eileen O Neill',
            type: 'systemuser',
          },
          priority: 54361,
          status: 'System Paused',
          tenancy: {
            address: 'Flat 3 313 Harrow Road, London, 3RJ',
            id: 2,
            name: 'Dummy Pommells',
          },
          title: 'Arrears - 50101743',
        },
        {
          createdOn: '2021-02-15T16:13:48+00:00',
          currentBalance: 0,
          daysInArrears: 16,
          id: 'abc3',
          lastModified: '2021-03-03T07:23:43+00:00',
          openTaskCount: 1,
          ownerOutputModel: {
            id: 'xyz3',
            name: 'Eileen O Neill',
            type: 'systemuser',
          },
          priority: 54361,
          status: 'System Paused',
          tenancy: {
            address: 'Flat 3 313 Harrow Road, London, 3RJ',
            id: 3,
            name: 'Dummy Pommells',
          },
          title: 'Arrears - 50101743',
        },
        {
          createdOn: '2021-02-15T16:13:48+00:00',
          currentBalance: 0,
          daysInArrears: 16,
          id: 'abc4',
          lastModified: '2021-03-03T07:23:43+00:00',
          openTaskCount: 1,
          ownerOutputModel: {
            id: 'xyz4',
            name: 'Eileen O Neill',
            type: 'systemuser',
          },
          priority: 54361,
          status: 'System Paused',
          tenancy: {
            address: 'Flat 3 313 Harrow Road, London, 3RJ',
            id: 4,
            name: 'Dummy Pommells',
          },
          title: 'Arrears - 50101743',
        },
        {
          createdOn: '2021-02-15T16:13:48+00:00',
          currentBalance: 0,
          daysInArrears: 16,
          id: 'abc5',
          lastModified: '2021-03-03T07:23:43+00:00',
          openTaskCount: 1,
          ownerOutputModel: {
            id: 'xyz5',
            name: 'Eileen O Neill',
            type: 'systemuser',
          },
          priority: 54361,
          status: 'System Paused',
          tenancy: {
            address: 'Flat 3 313 Harrow Road, London, 3RJ',
            id: 5,
            name: 'Dummy Pommells',
          },
          title: 'Arrears - 50101743',
        },
        {
          createdOn: '2021-02-15T16:13:48+00:00',
          currentBalance: 0,
          daysInArrears: 16,
          id: 'abc6',
          lastModified: '2021-03-03T07:23:43+00:00',
          openTaskCount: 1,
          ownerOutputModel: {
            id: 'xyz6',
            name: 'Eileen O Neill',
            type: 'systemuser',
          },
          priority: 54361,
          status: 'System Paused',
          tenancy: {
            address: 'Flat 3 313 Harrow Road, London, 3RJ',
            id: 6,
            name: 'Dummy Pommells',
          },
          title: 'Arrears - 50101743',
        },
      ],
    }).update();
    expect(el).toMatchSnapshot();
  });

  it('should render the page while loading arrears and tasks', () => {
    el.setProps({
      loadingArrears: true,
      loadingTasks: true,
    }).update();
    expect(el).toMatchSnapshot();
  });

  it('should update the header', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should call getTaskSummary', () => {
    expect(props.getTasksSummary).toHaveBeenCalled();
  });

  it('should call invalidateTasks on UnMount', () => {
    el.unmount();
    expect(props.invalidateTasks).toHaveBeenCalled();
  });

  describe('Tasks - no data message', () => {
    beforeEach(() => {
      el.setProps({
        arrears: [
          {
            businessUnit: 'PRH',
            id: 'foo',
            bar: 'baz',
            legalReferralCase: {
              formName: 'Friendly Form Name | legalReferralCaseFormName',
              lastSubmissionId: 'DEF456',
            },
            nospServeError: false,
            tenancyId: 'ABC123',
            createdOn: '1',
          },
        ],
      });
    });

    it('should render tasksNoDataMsg patch tasks is selected and there are no tasks', () => {
      el.setState({ statusFilterId: TASKS_SEL });
      const cards = el.find(TasksSummaryCards);
      expect(cards).toExist();
      expect(cards.props()).toHaveProperty('noDataMsg', props.tasksNoDataMsg);
    });

    it('should render myTasksNoDataMsg when my tasks is selected and there are no tasks', () => {
      el.setState({ statusFilterId: MY_TASKS_SEL });
      const cards = el.find(TasksSummaryCards);
      expect(cards).toExist();
      expect(cards.props()).toHaveProperty('noDataMsg', props.myTasksNoDataMsg);
    });

    it('should render myTasksNoDataMsg when user tasks is selected and there are no tasks', () => {
      el.setState({ statusFilterId: USER_TASKS_SEL });
      const cards = el.find(TasksSummaryCards);
      expect(cards).toExist();
      expect(cards.props()).toHaveProperty('noDataMsg', props.selectedUserTasksNoDataMsg);
    });
  });
});
