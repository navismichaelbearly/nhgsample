import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ActiveUserList, Loader } from 'nhh-styles';

import ArrearsSummaryCards, {
  cardPropTypes,
  cardLabelPropTypes,
} from '../../components/ArrearsSummaryCards';

import TasksSummaryCards, {
  taskCardPropTypes,
  taskCardLabelPropTypes,
} from '../../components/TasksSummaryCards';

import ArrearsFilters from '../../compositions/ArrearsDashboardFilters';

import { ErrorBoundary as EB } from '../../components';

import { PageContent, PatchStatistics } from '../';
import { PatchesWrapper } from './components';
import connect from './connect';

import { TASKS_SEL, MY_TASKS_SEL, USER_TASKS_SEL } from '../../constants/dropdownValues';

export class ArrearsDashboardComposition extends PureComponent {
  state = {
    statusFilterId: MY_TASKS_SEL,
  };

  componentDidMount() {
    this.props.getTasksSummary();
    this.props.getMyTasksSummary();
    this.props.getSelectedUserTasks();
    this.props.updatePageHeader();
  }

  componentWillUnmount() {
    this.props.invalidateTasks();
  }

  getNoDataMsg = () => {
    const {
      arrearsNoDataMsg,
      tasksNoDataMsg,
      myTasksNoDataMsg,
      selectedUserTasksNoDataMsg,
    } = this.props;

    const { statusFilterId } = this.state;

    if ([TASKS_SEL, MY_TASKS_SEL, USER_TASKS_SEL].includes(statusFilterId)) {
      if (statusFilterId === USER_TASKS_SEL) {
        return selectedUserTasksNoDataMsg;
      } else if (statusFilterId === MY_TASKS_SEL) {
        return myTasksNoDataMsg;
      }
      return tasksNoDataMsg;
    }
    return arrearsNoDataMsg;
  };

  handleChangeFilter = value => this.setState({ statusFilterId: value });

  render() {
    const {
      arrears,
      arrearsNoDataMsg,
      cardLabels,
      filterLabel,
      getArrearsSummary,
      getTasksSummary,
      getSummaryTasks,
      getSelectedUserTasks,
      loadingArrears,
      loadingTasks,
      onOpenPatchSelect,
      patches,
      profile,
      resultsCount,
      taskCardLabels,
      youText,
      tasks,
      myTasks,
      selectedUserTasks,
      viewMoreLoading,
    } = this.props;

    const sharedCardProps = {
      userId: profile.id,
      youText,
    };

    const getTasks = (tasksObj = {}) => {
      const { items = [], count = 0 } = tasksObj;
      return { items, count };
    };

    const getTaskAttr = statusFilterId => {
      const returnAttr = {};
      if (statusFilterId === USER_TASKS_SEL) {
        returnAttr.key = 'userTasksSel';
        returnAttr.nextPage = getSelectedUserTasks;
        returnAttr.data = selectedUserTasks;
      }
      if (statusFilterId === MY_TASKS_SEL) {
        returnAttr.key = 'myTasksSel';
        returnAttr.nextPage = getTasksSummary;
        returnAttr.data = myTasks;
      }
      if (statusFilterId === TASKS_SEL) {
        returnAttr.key = 'tasksSel';
        returnAttr.nextPage = getSummaryTasks;
        returnAttr.data = tasks;
      }
      return returnAttr;
    };

    const showTasksOrArrears = () => {
      const { statusFilterId } = this.state;
      // next line exists because of a requirement to show arrearsNoDataMsg on the Task view (being tasks hierarchically dependants on Arrears)
      const isEitherTasksOrArrearsLoading = loadingArrears && loadingTasks;
      if (isEitherTasksOrArrearsLoading) return <Loader />;

      if ([TASKS_SEL, MY_TASKS_SEL, USER_TASKS_SEL].includes(statusFilterId)) {
        const { items, count } = getTasks(getTaskAttr(statusFilterId).data);
        return (
          <Fragment>
            <TasksSummaryCards
              key={getTaskAttr(statusFilterId).key}
              kind={statusFilterId}
              tasks={items}
              resultCount={count}
              cardLabels={taskCardLabels}
              loading={loadingTasks}
              noDataMsg={this.getNoDataMsg()}
              getNextPage={getTaskAttr(statusFilterId).nextPage}
              {...sharedCardProps}
            />
            {viewMoreLoading && <Loader />}
          </Fragment>
        );
      }

      return (
        <ArrearsSummaryCards
          arrears={arrears}
          cardLabels={cardLabels}
          filterLabel={filterLabel}
          getArrearsSummary={getArrearsSummary}
          loading={loadingArrears}
          noDataMsg={arrearsNoDataMsg}
          resultsCount={resultsCount}
          {...sharedCardProps}
        />
      );
    };

    return (
      <PageContent>
        <div className="col-lg-9">
          <ArrearsFilters onChange={this.handleChangeFilter} />
        </div>
        <div className="col-lg-9">{showTasksOrArrears()}</div>
        <aside className="col-lg-3">
          <EB>
            <PatchesWrapper>
              <ActiveUserList
                openPatchSelect={onOpenPatchSelect}
                patches={patches.map(p => {
                  const isYou = profile.id === p.id;
                  const name = isYou ? youText : p.name;
                  return {
                    ...p,
                    name,
                    fullname: name,
                    customName: isYou,
                  };
                })}
              />
            </PatchesWrapper>
          </EB>
          <PatchStatistics />
        </aside>
      </PageContent>
    );
  }
}

ArrearsDashboardComposition.defaultProps = {
  arrears: null,
  filterLabel: 'ArrearsCardsPagination',
  patches: [],
  resultsCount: 0,
  selectedUserTasksCount: 0,
  tasks: null,
  myTasks: null,
  youText: '',
};

ArrearsDashboardComposition.propTypes = {
  arrearsNoDataMsg: PropTypes.string.isRequired,
  cardLabels: PropTypes.shape(cardLabelPropTypes).isRequired,
  getArrearsSummary: PropTypes.func.isRequired,
  getMyTasksSummary: PropTypes.func.isRequired,
  getSelectedUserTasks: PropTypes.func.isRequired,
  getStatuses: PropTypes.func.isRequired,
  getSummaryTasks: PropTypes.func.isRequired,
  getTasksSummary: PropTypes.func.isRequired,
  invalidateTasks: PropTypes.func.isRequired,
  loadingArrears: PropTypes.bool.isRequired,
  loadingTasks: PropTypes.bool.isRequired,
  myTasksNoDataMsg: PropTypes.string.isRequired,
  onOpenPatchSelect: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    patchName: PropTypes.string,
  }).isRequired,
  selectedUserTasks: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  selectedUserTasksNoDataMsg: PropTypes.string.isRequired,
  taskCardLabels: PropTypes.shape(taskCardLabelPropTypes).isRequired,
  tasksNoDataMsg: PropTypes.string.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  viewMoreLoading: PropTypes.bool.isRequired,
  arrears: PropTypes.arrayOf(PropTypes.shape(cardPropTypes).isRequired),
  filterLabel: PropTypes.string,
  myTasks: PropTypes.arrayOf(PropTypes.shape(taskCardPropTypes).isRequired),
  patches: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      patchName: PropTypes.string,
    }).isRequired
  ),
  resultsCount: PropTypes.number,
  selectedUserTasksCount: PropTypes.number,
  tasks: PropTypes.arrayOf(PropTypes.shape(taskCardPropTypes).isRequired),
  youText: PropTypes.string,
};

export default connect(ArrearsDashboardComposition);
