import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { Card, formatting, Pagination, Loader } from 'nhh-styles';
import pathOr from 'ramda/src/pathOr';

import NoDataMessage from '../../components/NoDataMessage';
import { Wrapper } from './components';

export const ArrearsSummaryCardsComponent = ({
  arrears,
  cardLabels,
  filterLabel,
  getArrearsSummary,
  theme,
  loading,
  noDataMsg,
  resultsCount,
  userId,
  youText,
}) => (
  <div>
    {!!arrears.length && (
      <Pagination
        items={arrears}
        pageSize={6}
        totalNumberOfItems={resultsCount}
        key={filterLabel} // Force page count update by using unique keys for result sets
        loading={loading}
        onNextPage={({ pageNumber }) => getArrearsSummary({ pageNumber })}
        render={cards => (
          <Wrapper>
            {cards.map((arrear, idx) => {
              const { id, name } = arrear.ownerOutputModel;
              const ownedByUser = id === userId;
              const ownerName = ownedByUser ? youText : name;
              const items = [
                {
                  title: cardLabels.notificationDate,
                  value: formatting.formatDate(arrear.createdOn),
                },
                {
                  title: cardLabels.currentBalance,
                  value: formatting.formatCurrency(arrear.currentBalance || 0),
                },
                {
                  title: cardLabels.tenantName,
                  value: pathOr('', ['tenancy', 'name'], arrear),
                },
                {
                  title: cardLabels.address,
                  value: pathOr('', ['tenancy', 'address'], arrear),
                },
                {
                  title: cardLabels.openTasks,
                  value: arrear.openTaskCount,
                },
              ];
              return (
                <Link
                  key={arrear.id}
                  data-bdd={`arrearsSummaryCard-${idx + 1}`}
                  to={`/arrears-details/${arrear.id}`}
                >
                  <Card>
                    <Card.Header
                      color={theme.colors.support.one}
                      badgeText={ownerName}
                      badgeUseInitials={!ownedByUser}
                    >
                      {cardLabels.heading}
                    </Card.Header>
                    <Card.Body items={items} />
                    <Card.Footer color={theme.colors.support.one}>{arrear.status}</Card.Footer>
                  </Card>
                </Link>
              );
            })}
          </Wrapper>
        )}
      />
    )}

    {loading && <Loader />}

    {!arrears.length && !loading && <NoDataMessage message={noDataMsg} />}
  </div>
);

export const cardPropTypes = {
  createdOn: PropTypes.string.isRequired,
  currentBalance: PropTypes.number,
  openTaskCount: PropTypes.number,
  tenancy: PropTypes.shape({
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export const cardLabelPropTypes = {
  address: PropTypes.string.isRequired,
  currentBalance: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  notificationDate: PropTypes.string.isRequired,
  openTasks: PropTypes.string.isRequired,
  tenantName: PropTypes.string.isRequired,
};

ArrearsSummaryCardsComponent.defaultProps = {
  arrears: [],
};

ArrearsSummaryCardsComponent.propTypes = {
  cardLabels: PropTypes.shape(cardLabelPropTypes).isRequired,
  filterLabel: PropTypes.string.isRequired,
  getArrearsSummary: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  noDataMsg: PropTypes.string.isRequired,
  resultsCount: PropTypes.number.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      support: PropTypes.shape({
        three: PropTypes.string,
      }),
    }),
  }).isRequired,
  userId: PropTypes.string.isRequired,
  youText: PropTypes.string.isRequired,
  arrears: PropTypes.arrayOf(PropTypes.shape(cardPropTypes)),
};

export default withTheme(ArrearsSummaryCardsComponent);
