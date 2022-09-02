import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { Card, formatting, Pagination, Loader } from 'nhh-styles';
import pathOr from 'ramda/src/pathOr';
import isAfter from 'date-fns/is_after';

import { Wrapper, OverdueLabel } from './components';
import NoDataMessage from '../../components/NoDataMessage';

const CardComponent = (task, cardLabels, theme, items, taskIsOverdue, userId, youText) => {
  const { id, name } = task.owner;
  const ownedByUser = id === userId;
  const ownerName = ownedByUser ? youText : name;
  return (
    <Card>
      <Card.Header
        color={theme.colors.secondary}
        badgeText={ownerName}
        badgeUseInitials={!ownedByUser}
      >
        {cardLabels.heading}
      </Card.Header>
      <Card.Body items={items} />
      <Card.Footer color={theme.colors.secondary}>
        {task.status}{' '}
        {taskIsOverdue ? (
          <OverdueLabel themedColor={theme.colors.support.two}> {cardLabels.overdue}</OverdueLabel>
        ) : null}
      </Card.Footer>
    </Card>
  );
};

const getCaseUrl = item => {
  if (item && item.type) {
    return `/arrears-details/${item.id}`;
  }
  return '/';
};

export const TasksSummaryCardsComponent = ({
  userId,
  youText,
  tasks,
  resultCount,
  cardLabels,
  theme,
  loading,
  getNextPage,
  noDataMsg,
}) =>
  // eslint-disable-next-line no-nested-ternary
  loading ? (
    <Loader />
  ) : tasks && tasks.length && !loading ? (
    <Pagination
      items={tasks}
      totalNumberOfItems={resultCount}
      pageSize={6}
      onNextPage={({ pageNumber }) => getNextPage({ pageNumber })}
      render={cards => (
        <Wrapper>
          {cards.map((task, idx) => {
            const taskDueDate = task.dueDate ? formatting.formatDate(task.dueDate) : null;
            const taskIsOverdue = taskDueDate ? isAfter(new Date(), task.dueDate) : false;
            const items = [
              {
                title: task.type === 'system' ? cardLabels.dueDate : cardLabels.doDate,
                value: taskDueDate || 'N/A',
              },
              {
                title: cardLabels.taskOwner,
                value: pathOr('', ['owner', 'name'], task),
              },
              {
                title: cardLabels.title,
                value: task.title,
              },
              {
                title: cardLabels.customerName,
                value: task.tenantName,
              },
              {
                title: cardLabels.address,
                value: task.assetName,
              },
            ];
            return (
              <Link
                key={task.id}
                data-bdd={`tasksSummaryCard-${idx + 1}`}
                to={getCaseUrl(task.regardingObjectModel)}
              >
                {CardComponent(task, cardLabels, theme, items, taskIsOverdue, userId, youText)}
              </Link>
            );
          })}
        </Wrapper>
      )}
    />
  ) : (
    <NoDataMessage message={noDataMsg} />
  );

export const taskCardPropTypes = {
  dueDate: PropTypes.string,
  assetName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  tenantName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  owner: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
  regardingObjectModel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
};

export const taskCardLabelPropTypes = {
  address: PropTypes.string.isRequired,
  customerName: PropTypes.string.isRequired,
  dueDate: PropTypes.string,
  taskOwner: PropTypes.string,
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  overdue: PropTypes.string.isRequired,
};

TasksSummaryCardsComponent.defaultProps = {
  cardHeading: null,
  tasks: [],
};

TasksSummaryCardsComponent.propTypes = {
  cardLabels: PropTypes.shape(taskCardLabelPropTypes).isRequired,
  loading: PropTypes.bool.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      support: PropTypes.shape({
        three: PropTypes.string,
      }),
    }).isRequired,
  }).isRequired,
  userId: PropTypes.string.isRequired,
  youText: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(PropTypes.shape(taskCardPropTypes)),
};

CardComponent.PropTypes = {
  ...TasksSummaryCardsComponent.propTypes,
  userId: PropTypes.string.isRequired,
  youText: PropTypes.string.isRequired,
  items: PropTypes.arrayOf({
    title: PropTypes.string,
    value: PropTypes.string,
  }),
  taskIsOverdue: PropTypes.bool.isRequired,
};

export default withTheme(TasksSummaryCardsComponent);
