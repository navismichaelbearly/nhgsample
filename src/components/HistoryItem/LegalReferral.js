import React from 'react';
import PropTypes from 'prop-types';
import { formatting, Table } from 'nhh-styles';
import { legalReferralPropType } from '../../compositions/ActivityHistoryItem';
import { Label, Title } from './components';
import { status as legalReferralStatus } from '../../constants/legalReferral';

const LegalReferral = ({
  originalType,
  progressStatus,
  owner,
  formName,
  approvalDetail,
  lastModifiedAt,
  lastModifiedBy,
  createdAt,
  createdBy,
  status,
  referralPack,
  labels,
}) => {
  let isApprovedOrRejected;
  let isRejectedLabelApplicable;
  switch (progressStatus) {
    case legalReferralStatus.complete: {
      isApprovedOrRejected = true;
      isRejectedLabelApplicable = false;
      break;
    }
    case legalReferralStatus.rejected: {
      isApprovedOrRejected = true;
      isRejectedLabelApplicable = true;
      break;
    }
    default: {
      isApprovedOrRejected = false;
      isRejectedLabelApplicable = false;
    }
  }

  const mainTableData = [
    [
      <Label>{labels.createdAt}</Label>,
      <span data-bdd={`ActivityHistoryItem-legalReferral-date`}>
        {formatting.formatDate(createdAt, formatting.dateTimeFormat)}
      </span>,
    ],
    [
      <Label>{labels.createdBy}</Label>,
      <span data-bdd={`ActivityHistoryItem-legalReferral-rasiedBy`}>{createdBy}</span>,
    ],
    [
      <Label>{labels.formName}</Label>,
      <span data-bdd={`ActivityHistoryItem-legalReferral-with`}>{formName}</span>,
    ],
    [
      <Label>{labels.progressStatus}</Label>,
      <span data-bdd={`ActivityHistoryItem-legalReferral-with`}>{progressStatus}</span>,
    ],
    [
      <Label>{labels.owner}</Label>,
      <span data-bdd={`ActivityHistoryItem-legalReferral-with`}>{owner.name}</span>,
    ],
    [
      <Label>{labels.link}</Label>,
      <span data-bdd={`ActivityHistoryItem-legalReferral-with`}>
        {referralPack.legalReferralPack.link}
      </span>,
    ],
    [
      <Label>{labels.lastModifiedOn}</Label>,
      <span data-bdd={`ActivityHistoryItem-legalReferral-lastModified`}>
        {formatting.formatDate(lastModifiedAt, formatting.dateTimeFormat)}
        <span data-bdd={`ActivityHistoryItem-legalReferral-by`}>
          {' '}
          <Label>{labels.by}</Label> {lastModifiedBy}
        </span>
      </span>,
    ],
    [
      <Label>{labels.status}</Label>,
      <span data-bdd={`ActivityHistoryItem-legalReferral-modified`}>{status}</span>,
    ],
  ];

  const approvedRejected = [
    [
      <Label>{isRejectedLabelApplicable ? labels.rejected : labels.approval}</Label>,
      <span data-bdd={`ActivityHistoryItem-legalReferral-approval`}>
        {formatting.formatDate(approvalDetail.decisionDate, formatting.dateTimeFormat)}
        <span data-bdd={`ActivityHistoryItem-legalReferral-approval-by`}>
          {' '}
          <Label>{labels.by}</Label> {approvalDetail.userName}
        </span>
      </span>,
    ],
  ];

  const finalTable = isApprovedOrRejected ? [...mainTableData, ...approvedRejected] : mainTableData;

  return (
    <div>
      <Title>{originalType}</Title>
      <Table
        addExtraTd={false}
        data-bdd="ActivityHistoryItemTable"
        data={finalTable}
        striped
        tdWrap
        topAlign
      />
    </div>
  );
};

LegalReferral.propTypes = {
  approvalDetail: PropTypes.shape({
    decisionDate: PropTypes.string,
    userName: PropTypes.string,
  }).isRequired,
  createdAt: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  labels: PropTypes.shape(legalReferralPropType).isRequired,
  lastModifiedAt: PropTypes.string.isRequired,
  lastModifiedBy: PropTypes.string.isRequired,
  originalType: PropTypes.string.isRequired,
  owner: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  progressStatus: PropTypes.string.isRequired,
  referralPack: PropTypes.shape({
    legalReferralPack: PropTypes.shape({
      link: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  status: PropTypes.string.isRequired,
};

export default LegalReferral;
