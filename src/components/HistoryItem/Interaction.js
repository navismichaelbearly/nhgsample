import React from 'react';
import PropTypes from 'prop-types';
import format from 'string-format';
import { formatting, Table } from 'nhh-styles';
import renderHtml from 'react-render-html';
import { unescape } from 'lodash';
import { Description, Label, Title, Value } from './components';

const Interaction = ({
  activityTime,
  activityType,
  created,
  description,
  from,
  incoming,
  labels,
  modified,
  owner,
  to,
  values,
}) => (
  <div>
    <Title>{activityType}</Title>
    <Table
      addExtraTd={false}
      data-bdd="ActivityHistoryItemTable"
      data={[
        [
          <Label>{labels.interactionWith}</Label>,
          <Value data-bdd={`ActivityHistoryItem-interaction-with`}>
            {format(values.interactionWith, {
              name: incoming ? from && from.name : to && to.name,
              type: incoming ? values.inbound : values.outbound,
            })}
          </Value>,
        ],
        [
          <Label>{labels.interactionTime}</Label>,
          <Value data-bdd={`ActivityHistoryItem-interaction-date`}>
            {formatting.formatDate(activityTime, formatting.dateTimeFormat)}
          </Value>,
        ],
        [
          <Label>{labels.createdOn}</Label>,
          <Value data-bdd={`ActivityHistoryItem-interaction-created`}>
            {formatting.formatDate(created.on, formatting.dateTimeFormat)}
          </Value>,
        ],
        [
          <Label>{labels.modified}</Label>,
          <Value data-bdd={`ActivityHistoryItem-interaction-modified`}>
            {formatting.formatDate(modified.on, formatting.dateTimeFormat)}
          </Value>,
        ],
        [
          <Label>{labels.raisedBy}</Label>,
          <Value data-bdd={`ActivityHistoryItem-interaction-rasiedBy`}>{owner}</Value>,
        ],
      ]}
      striped
      tdWrap
      topAlign
    />
    {description && (
      <Description>
        <Label>{labels.description}</Label>
        <br />
        <Value data-bdd={`ActivityHistoryItem-interaction-description`}>
          {description && renderHtml(unescape(description))}
        </Value>
      </Description>
    )}
  </div>
);

Interaction.defaultProps = {
  incoming: false,
  from: null,
  to: null,
};

Interaction.propTypes = {
  activityTime: PropTypes.string.isRequired,
  activityType: PropTypes.string.isRequired,
  created: PropTypes.shape({
    on: PropTypes.string.isRequired,
  }).isRequired,
  description: PropTypes.string.isRequired,
  labels: PropTypes.shape({
    createdOn: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    interactionTime: PropTypes.string.isRequired,
    interactionWith: PropTypes.string.isRequired,
    modified: PropTypes.string.isRequired,
    raisedBy: PropTypes.string.isRequired,
  }).isRequired,
  modified: PropTypes.shape({
    on: PropTypes.string.isRequired,
  }).isRequired,
  owner: PropTypes.string.isRequired,
  values: PropTypes.shape({
    interactionWith: PropTypes.string.isRequired,
  }).isRequired,
  from: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  incoming: PropTypes.bool,
  to: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default Interaction;
