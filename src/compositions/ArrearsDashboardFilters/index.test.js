import React from 'react';
import { shallow } from 'enzyme';

import { ArrearsFiltersComposition } from './';
import { TASKS_SEL, MY_TASKS_SEL } from '../../constants/dropdownValues';

describe('<ArrearsFiltersComposition />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      arrearsDashboardLabels: {
        customerHeading: 'My arrears',
        housingOfficerHeading: 'Arrears',
        priority: 'Priority',
        currentBalance: 'Current Balance',
        daysInArrears: 'Days in Arrears',
        sortBy: 'Sort By',
        stage: 'Stage',
        show: 'Show',
        selectAStage: 'Select a Stage',
        tasks: 'Tasks',
      },
      filterLabels: {
        allStages: 'All Stages',
        arrears: 'Arrears - {status} ({count})',
        arrearsByStage: '\u00A0\u00A0\u00A0\u00A0{stage} ({count})',
      },
      heading: 'titleText',
      getMyTasksSummary: jest.fn(),
      getTasksSummary: jest.fn(),
      getArrearStatuses: jest.fn(),
      getTaskStatuses: jest.fn(),
      getMyTasksStats: jest.fn(),
      getSelectedUserTasks: jest.fn(),
      getSummaryTasks: jest.fn(),
      arrearStatuses: {
        All: {
          count: 11,
          id: null,
          products: [
            {
              product: 'Leasehold',
              stages: [
                {
                  id: '4cb2fc58-4b75-e811-80c5-00155d072d63',
                  name: 'Stage 2',
                  count: 6,
                },
              ],
            },
          ],
        },
        'In Progress': {
          count: 10,
          id: 1,
          products: [
            {
              product: 'Leasehold',
              stages: [
                {
                  id: '4cb2fc58-4b75-e811-80c5-00155d072d63',
                  name: 'Stage 2',
                  count: 6,
                },
              ],
            },
            {
              product: 'PRH',
              stages: [
                {
                  id: '4cb2fc58-4b75-e811-80c5-00155d072d63',
                  name: '3wks Arrears',
                  count: 2,
                },
                {
                  id: '68027d4f-4b75-e811-80c5-00155d072d63',
                  name: '< 3wks Arrears',
                  count: 2,
                },
              ],
            },
          ],
        },
        'Manually Paused': {
          count: 1,
          id: 857920000,
          products: [
            {
              product: 'Leasehold',
              stages: [
                {
                  id: '4cb2fc58-4b75-e811-80c5-00155d072d63',
                  name: 'Stage 2',
                  count: 1,
                },
              ],
            },
          ],
        },
      },
      taskStatuses: {},
      myTasksStats: {},
      myTasks: [],
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
      getArrearsSummary: jest.fn(),
      onOpenPatchSelect: jest.fn(),
      onChange: jest.fn(),
      selectedUserTasksCount: 0,
      mySummaryItemsCount: 0,
    };

    el = shallow(<ArrearsFiltersComposition {...props} />);
    el.setState({ statusFilterId: null });
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should call getTaskStatuses', () => {
    expect(props.getTaskStatuses).toHaveBeenCalled();
  });

  it('should call all APIs when changing patches', () => {
    const patches = [{ name: 'rock', patchName: 'roll' }];
    el.setProps({ patches });
    expect(props.getTaskStatuses).toHaveBeenCalled();
    expect(props.getArrearStatuses).toHaveBeenCalled();
    expect(props.getTasksSummary).toHaveBeenCalled();
    expect(props.getMyTasksSummary).toHaveBeenCalled();
    expect(props.getArrearsSummary).toHaveBeenCalled();
    expect(props.onChange).toHaveBeenCalledWith(MY_TASKS_SEL);
  });

  it('should call the getArrearsSummary APIs when changing STATUS filters to an Arrears choice', () => {
    const instance = el.instance();
    instance.toggleArrearsOrTasks({ value: 1, label: 'my fantastic label', count: 10 });
    expect(props.getArrearsSummary).toHaveBeenCalledWith(
      { sort: 'priority', status: 1 },
      { value: 1, label: 'my fantastic label', count: 10 }
    );
  });

  it('should call the getTasksSummary APIs when changing STATUS filters to a Tasks choice', () => {
    el.instance().toggleArrearsOrTasks({ value: TASKS_SEL, label: 'my fantastic label' });
    expect(props.getTaskStatuses).toHaveBeenCalled();
  });

  it('should call the getArrearsSummary APIs with correct parameters when changing SORT filter', () => {
    el.setState({ currentResultsCount: 10 });
    el.instance().toggleArrearsSorting({ value: 'priority', label: 'my fantastic label' });
    expect(props.getArrearsSummary).toHaveBeenCalledWith(
      {
        arrearsStageId: null,
        offerType: null,
        sort: 'priority',
        status: null,
      },
      { value: 'priority', label: 'my fantastic label', count: 10 }
    );
  });

  it('should call the getArrearsSummary APIs with correct parameters when changing STAGE filter', () => {
    el.instance().toggleArrearsStage({ value: 'my value', label: 'my fantastic label', count: 5 });
    expect(props.getArrearsSummary).toHaveBeenCalledWith(
      {
        arrearsStageId: 'my value',
        offerType: undefined,
        sort: 'priority',
        status: null,
      },
      { value: 'my value', label: 'my fantastic label', count: 5 }
    );
  });

  it('should call the getArrearsSummary APIs with correct parameters when setting STAGE filter to "All Stages"', () => {
    el.instance().toggleArrearsStage({ value: '', label: 'All Stages' });
    expect(props.getArrearsSummary).toHaveBeenCalledWith(
      {
        arrearsStageId: '',
        offerType: undefined,
        sort: 'priority',
        status: null,
      },
      { value: '', label: 'All Stages' }
    );
  });

  it('should show the correct items in the stage filter when a status is selected', () => {
    el.setState({ statusFilterId: 1, statusFilterName: 'In Progress' });
    el.update();
    el.instance().toggleArrearsOrTasks({
      value: 857920000,
      label: 'In Progress',
      name: 'In Progress',
    });
    el.update();
    expect(el.state('stageItems')).toEqual([
      { label: 'All Stages', value: '' },
      { disabled: true, label: 'Leasehold', value: null },
      {
        count: 6,
        id: 'Stage 2',
        label: '    Stage 2 (6)',
        name: 'Stage 2',
        product: 'Leasehold',
        value: '4cb2fc58-4b75-e811-80c5-00155d072d63',
      },
      { disabled: true, label: 'PRH', value: null },
      {
        count: 2,
        id: '3wks Arrears',
        label: '    3wks Arrears (2)',
        name: '3wks Arrears',
        product: 'PRH',
        value: '4cb2fc58-4b75-e811-80c5-00155d072d63',
      },
      {
        count: 2,
        id: '< 3wks Arrears',
        label: '    < 3wks Arrears (2)',
        name: '< 3wks Arrears',
        product: 'PRH',
        value: '68027d4f-4b75-e811-80c5-00155d072d63',
      },
    ]);
  });

  it('should call getArrearStatuses on init', () => {
    expect(props.getArrearStatuses).toHaveBeenCalled();
  });
});
