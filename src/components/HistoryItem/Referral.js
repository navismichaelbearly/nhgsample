import React from 'react';
import PropTypes from 'prop-types';
import { formatting, Table } from 'nhh-styles';
import { referralLabelsPropType } from '../../compositions/ActivityHistoryItem';

import { Label, Title } from './components';

const Referral = ({ teamName, details, raisedBy, createdOn, labels, type }) => (
  <div>
    <Title>{type}</Title>
    <Table
      addExtraTd={false}
      data-bdd="ActivityHistoryItemTable"
      data={[
        [
          <Label>{labels.createdOn}</Label>,
          <span data-bdd={`ActivityHistoryItem-createdOn`}>
            {formatting.formatDate(createdOn, formatting.dateTimeFormat)}
          </span>,
        ],
        [
          <Label>{labels.detail}</Label>,
          <span data-bdd={`ActivityHistoryItem-details`}>{details}</span>,
        ],
        [
          <Label>{labels.raisedBy}</Label>,
          <span data-bdd={`ActivityHistoryItem-raisedBy`}>{raisedBy.name}</span>,
        ],
        [
          <Label>{labels.teamName}</Label>,
          <span data-bdd={`ActivityHistoryItem-teamName`}>
            {teamName && teamName.referrableTeams.length ? (
              <Table
                addExtraTd={false}
                data-bdd="ActivityHistoryItemTable-teamName-items"
                data={[teamName.referrableTeams.map(team => team.name)]}
                tdWrap
                topAlign
              />
            ) : null}
          </span>,
        ],
      ]}
      striped
      tdWrap
      topAlign
    />
  </div>
);

Referral.defaultProps = {
  details: 'N/A',
};

Referral.propTypes = {
  createdOn: PropTypes.string.isRequired,
  labels: PropTypes.shape(referralLabelsPropType).isRequired,
  raisedBy: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  teamName: PropTypes.shape({
    referrableTeams: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      })
    ),
  }).isRequired,
  type: PropTypes.string.isRequired,
  details: PropTypes.string,
};

export default Referral;
