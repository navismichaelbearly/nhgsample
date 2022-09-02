import * as React from 'react';
import PropTypes from 'prop-types';
import format from 'string-format';

import { Select } from 'nhh-styles';
import pathOr from 'ramda/src/pathOr';

import connect from './connect';
import getStageItems from '../../util/getArrearsStages';
import SelectWrapper from './components';

import {
  TASKS_SEL,
  MY_TASKS_SEL,
  USER_TASKS_SEL,
  PRIORITY_SEL,
  CURRENT_BALANCE_SEL,
  DAYS_IN_ARREARS_SEL,
} from '../../constants/dropdownValues';

export class ArrearsFiltersComposition extends React.Component {
  constructor(props) {
    super(props);
    this.props.getMyTasksStats();
    this.props.getTaskStatuses();
    this.props.getArrearStatuses();
  }

  state = {
    currentResultsCount: null,
    totalResultsCount: null,
    statusFilterId: MY_TASKS_SEL,
    arrearsStageId: null,
    sorting: PRIORITY_SEL,
    stageItems: [],
    offerType: null,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.patches !== this.props.patches) {
      nextProps.getArrearsSummary();
      nextProps.getMyTasksSummary();
      nextProps.getTasksSummary({ EntityType: 'Arrears' });
      nextProps.getArrearStatuses();
      nextProps.getTaskStatuses();
      nextProps.getMyTasksStats();
      nextProps.getSelectedUserTasks();
      this.setState(
        { statusFilterId: MY_TASKS_SEL, sorting: PRIORITY_SEL },
        nextProps.onChange(MY_TASKS_SEL)
      );
    }
  }

  toggleArrearsOrTasks = item => {
    if (item.value !== this.state.statusFilterId) {
      if (item.value === TASKS_SEL) {
        this.props.getSummaryTasks();
      } else if (item.value === MY_TASKS_SEL) {
        this.props.getMyTasksSummary();
      } else if (item.value === USER_TASKS_SEL) {
        this.props.getSelectedUserTasks();
      } else {
        this.props.getArrearStatuses();
        this.props.getArrearsSummary({ status: item.value, sort: this.state.sorting }, item);
      }
      this.setState(
        {
          totalResultsCount: item.count,
          currentResultsCount: item.count,
          statusFilterId: item.value,
          arrearsStageId: null,
          stageItems: getStageItems(item.name, this.props.arrearStatuses, this.props.filterLabels),
        },
        this.props.onChange(item.value)
      );
    }
  };

  toggleArrearsStage = item => {
    if (item.value !== null) {
      const arrearsStageId = item.value;
      this.props.getArrearsSummary(
        {
          status: this.state.statusFilterId,
          arrearsStageId,
          sort: this.state.sorting,
          offerType: item.product,
        },
        item
      );

      this.setState({
        currentResultsCount: item.count || this.state.totalResultsCount,
        arrearsStageId,
        status: this.state.statusFilterId,
        offerType: item.product,
      });
    }
  };

  toggleArrearsSorting = item => {
    this.props.getArrearsSummary(
      {
        sort: item.value,
        status: this.state.statusFilterId,
        arrearsStageId: this.state.arrearsStageId,
        offerType: this.state.offerType,
      },
      { ...item, count: this.state.currentResultsCount }
    );
    this.setState({ sorting: item.value });
  };

  render() {
    const {
      taskStatuses,
      arrearsDashboardLabels,
      arrearStatuses,
      filterLabels,
      selectedUserTasksCount,
      mySummaryItemsCount,
    } = this.props;

    const { statusFilterId, arrearsStageId, sorting, stageItems, offerType } = this.state;

    const isTasksFilterActive = [TASKS_SEL, MY_TASKS_SEL, USER_TASKS_SEL].includes(statusFilterId);

    const tasksCount = pathOr(null, ['Arrears', 'Open', 'count'], taskStatuses);

    const statusItems = Object.keys(arrearStatuses).map(item => ({
      value: arrearStatuses[item].id,
      name: item,
      label: format(filterLabels.arrears, { status: item, count: arrearStatuses[item].count }),
      count: arrearStatuses[item].count,
    }));

    // dynamic labels
    const tasksItems = [
      {
        value: MY_TASKS_SEL,
        label: `${arrearsDashboardLabels.myTasks} (${mySummaryItemsCount})`,
        id: MY_TASKS_SEL,
      },
      {
        value: TASKS_SEL,
        label: `${arrearsDashboardLabels.tasks} ${tasksCount ? `(${tasksCount})` : ''}`,
        id: TASKS_SEL,
      },
      {
        value: USER_TASKS_SEL,
        label: `${arrearsDashboardLabels.selectedUserTasks} ${
          selectedUserTasksCount ? `(${selectedUserTasksCount})` : ''
        }`,
        id: USER_TASKS_SEL,
      },
      ...statusItems,
    ];

    // hardcoded labels
    const sortingItems = [
      { value: PRIORITY_SEL, id: PRIORITY_SEL, label: arrearsDashboardLabels.priority },
      {
        value: CURRENT_BALANCE_SEL,
        id: CURRENT_BALANCE_SEL,
        label: arrearsDashboardLabels.currentBalance,
      },
      {
        value: DAYS_IN_ARREARS_SEL,
        id: DAYS_IN_ARREARS_SEL,
        label: arrearsDashboardLabels.daysInArrears,
      },
    ];

    const getCurrentLabel = () =>
      tasksItems.filter(item => item.value === statusFilterId).shift().label;

    const getCurrentSortingLabel = () =>
      sortingItems.filter(item => item.value === sorting).shift().label;

    const getCurrentStageLabel = () => {
      if (arrearsStageId && offerType) {
        const tempArray = stageItems.filter(
          item => item && item.value === arrearsStageId && item.product === offerType
        );
        const [retItem = { label: '' }] = tempArray;
        return retItem.label.trim();
      }
      return '';
    };

    return (
      <React.Fragment>
        <div className="row">
          <SelectWrapper data-bdd={'ArrearsFilters-ArrearsFilters'}>
            <Select
              inline
              isFullWidth
              labelText={arrearsDashboardLabels.show}
              items={tasksItems}
              itemToString={item => (item ? item.label : '')}
              onChange={this.toggleArrearsOrTasks}
              inputValue={getCurrentLabel()}
            />
          </SelectWrapper>
          {!isTasksFilterActive && (
            <Select
              isFullWidth
              inline
              labelText={arrearsDashboardLabels.sortBy}
              items={sortingItems}
              itemToString={item => (item ? item.label : '')}
              onChange={this.toggleArrearsSorting}
              inputValue={getCurrentSortingLabel()}
            />
          )}
        </div>
        {!isTasksFilterActive && (
          <div className="row">
            <SelectWrapper data-bdd={'ArrearsFilters-StageFilter'}>
              <Select
                isFullWidth
                inline
                labelText={arrearsDashboardLabels.stage}
                items={stageItems}
                itemToString={stage => (stage ? `${stage.label}` : '')}
                onChange={this.toggleArrearsStage}
                placeholder={arrearsDashboardLabels.selectAStage}
                inputValue={getCurrentStageLabel()}
              />
            </SelectWrapper>
          </div>
        )}
      </React.Fragment>
    );
  }
}

ArrearsFiltersComposition.defaultProps = {
  patches: [],
};

ArrearsFiltersComposition.propTypes = {
  arrearsDashboardLabels: PropTypes.shape({
    currentBalance: PropTypes.string,
    daysInArrears: PropTypes.string,
    priority: PropTypes.string,
    selectAStage: PropTypes.string,
    show: PropTypes.string,
    sortBy: PropTypes.string,
    stage: PropTypes.string,
    tasks: PropTypes.string,
  }).isRequired,
  arrearStatuses: PropTypes.object.isRequired,
  filterLabels: PropTypes.shape({
    allStages: PropTypes.string.isRequired,
    arrears: PropTypes.string.isRequired,
    arrearsByStage: PropTypes.string.isRequired,
  }).isRequired,
  getArrearsSummary: PropTypes.func.isRequired,
  getArrearStatuses: PropTypes.func.isRequired,
  getMyTasksStats: PropTypes.func.isRequired,
  getMyTasksSummary: PropTypes.func.isRequired,
  getSelectedUserTasks: PropTypes.func.isRequired,
  getSummaryTasks: PropTypes.func.isRequired,
  getTasksSummary: PropTypes.func.isRequired,
  getTaskStatuses: PropTypes.func.isRequired,
  mySummaryItemsCount: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedUserTasksCount: PropTypes.number.isRequired,
  taskStatuses: PropTypes.object.isRequired,
  patches: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      patchName: PropTypes.string,
    }).isRequired
  ),
};

export default connect(ArrearsFiltersComposition);
