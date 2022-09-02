import React from 'react';
import PropTypes from 'prop-types';
import { formatting, Table } from 'nhh-styles';
import styled from 'styled-components';
import { pauseLabelsPropType } from '../../compositions/ActivityHistoryItem';
import splitAndWrap from '../../util/splitAndWrap';
import { DRAFT } from '../../constants/pause';

import { Label, Title } from './components';

const Pause = ({
  type,
  labels,
  status,
  reasonId,
  endDate,
  furtherDetail,
  isExtended,
  originalStartDate,
  lastModifiedAt,
  lastModifiedBy,
  createdAt,
  createdBy,
  isManagerNotified,
  approvalDetail,
  owner,
  cancelReason,
  notifcationDetail,
}) => {
  // format the table view by the requirement contraints
  const buildTableDataFrom = (_status, _isManagerNotified, _approvalDetail) => {
    const formatDate = date => formatting.formatDate(date, formatting.dateTimeFormat);
    const headBatch = [
      [
        <Label>{labels.createdOn}</Label>,
        <span data-bdd={`ActivityHistoryItem-createdOn`}>
          {formatDate(createdAt)}
          {' - '}
          <Label> {labels.createdBy}: </Label>
          {createdBy}
        </span>,
      ],
      [
        <Label>{labels.status}</Label>,
        <span data-bdd={`ActivityHistoryItem-status`}>
          {`${_status} ${isExtended ? labels.isExtended : ''}`}
        </span>,
      ],
      [
        <Label>{labels.reason}</Label>,
        <span data-bdd={`ActivityHistoryItem-reason`}>{reasonId}</span>,
      ],
      [
        <Label>{labels.originalStartDate}</Label>,
        <span data-bdd={`ActivityHistoryItem-startDate`}>{formatDate(originalStartDate)}</span>,
      ],
      [
        <Label>{labels.furtherDetail}</Label>,
        <span data-bdd={`ActivityHistoryItem-details`}>
          {splitAndWrap(furtherDetail, '\n', styled.div({}))}
        </span>,
      ],
      [
        <Label>{labels.lastModifiedOn}</Label>,
        <span data-bdd={`ActivityHistoryItem-modifiedOn`}>
          {formatDate(lastModifiedAt)}
          {' - '}
          <Label>{labels.lastModifiedBy}: </Label> {lastModifiedBy}
          {cancelReason ? (
            <React.Fragment>
              <br />
              <Label>{labels.cancelReason}: </Label>
              {cancelReason}
            </React.Fragment>
          ) : (
            ''
          )}
        </span>,
      ],
    ];

    const tailBatch = [
      [
        <Label>{labels.endDate}</Label>,
        <span data-bdd={`ActivityHistoryItem-endDate`}>{formatDate(endDate)}</span>,
      ],
    ];

    const isApprovedOrRejectedOnly = [
      [
        <Label>{_approvalDetail.isApproved ? labels.isApproved : labels.isRejected}</Label>,
        <span data-bdd={`ActivityHistoryItem-isApproved`}>
          {formatDate(_approvalDetail.decisionDate)}
          {' - '}
          <Label>{labels.approvedBy}: </Label> {_approvalDetail.userName}
        </span>,
      ],
    ];

    const isManagerNotifiedOnly = [
      [
        <Label>{labels.notified}</Label>,
        <span data-bdd={`ActivityHistoryItem-notified`}>
          {notifcationDetail.notifiedUserName}
          {' - '}
          <Label>{labels.notifiedOn}:</Label> {formatDate(createdAt)}
        </span>,
      ],
    ];

    const isDraftOnly = [
      [
        <Label>{labels.ownerName}</Label>,
        <span data-bdd={`ActivityHistoryItem-owner`}>{owner.name ? owner.name : ''}</span>,
      ],
    ];

    let finalArray = headBatch;

    if (_status === DRAFT) {
      finalArray = finalArray.concat(isDraftOnly);
    }
    if (_approvalDetail && _status !== DRAFT) {
      finalArray = finalArray.concat(isApprovedOrRejectedOnly);
    }
    if (_isManagerNotified) {
      finalArray = finalArray.concat(isManagerNotifiedOnly);
    }

    return finalArray.concat(tailBatch);
  };

  return (
    <div>
      <Title>{type}</Title>
      <Table
        addExtraTd={false}
        data-bdd="ActivityHistoryItemTable"
        data={buildTableDataFrom(status, isManagerNotified, approvalDetail)}
        striped
        tdWrap
        topAlign
      />
    </div>
  );
};

Pause.defaultProps = {
  approvalDetail: {
    isApproved: false,
    userName: null,
    decisionDate: null,
  },
  notifcationDetail: {
    wasNotified: false,
    notifiedUserName: null,
  },
  owner: {
    id: null,
    name: null,
    type: null,
  },
  raisedBy: { name: null },
};

Pause.propTypes = {
  cancelReason: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  furtherDetail: PropTypes.string.isRequired,
  isExtended: PropTypes.bool.isRequired,
  isManagerNotified: PropTypes.bool.isRequired,
  labels: PropTypes.shape(pauseLabelsPropType).isRequired,
  lastModifiedAt: PropTypes.string.isRequired,
  lastModifiedBy: PropTypes.string.isRequired,
  originalStartDate: PropTypes.string.isRequired,
  reasonId: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  approvalDetail: PropTypes.shape({
    decisionDate: PropTypes.string,
    isApproved: PropTypes.bool,
    userName: PropTypes.string,
  }),
  notifcationDetail: PropTypes.shape({
    notifiedUserName: PropTypes.string,
    wasNotified: PropTypes.bool,
  }),
  owner: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
  }),
};

export default Pause;
