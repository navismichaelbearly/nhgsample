import React from 'react';
import PropTypes from 'prop-types';
import { formatting, Table } from 'nhh-styles';

import { installmentArrangement } from '../../util/paymentPlan';

import { Label, Title } from './components';

const PaymentPlan = ({
  originalType,
  lastModifiedAt,
  lastModifiedBy,
  status,
  installment,
  startDate,
  labels,
  endDate,
  description,
}) => {
  const dataTable = [
    [
      <Label>{labels.detail}</Label>,
      <span data-bdd={`ActivityHistoryItem-paymentPlan-rasiedBy`}>{originalType}</span>,
    ],
    [
      <Label>{labels.status}</Label>,
      <span data-bdd={`ActivityHistoryItem-paymentPlan-with`}>{status}</span>,
    ],
    [
      <Label>{labels.startDate}</Label>,
      <span data-bdd={`ActivityHistoryItem-paymentPlan-startDate`}>
        {formatting.formatDate(startDate, formatting.dateTimeFormat)}
      </span>,
    ],
    [
      <Label>{labels.installment}</Label>,
      <span data-bdd={`ActivityHistoryItem-installment`}>
        {installmentArrangement(
          labels.installmentArrangementFormat,
          installment.amount,
          installment.period,
          formatting.formatDate(startDate),
          installment.schedule
        )}
      </span>,
    ],
    [
      <Label>{labels.lastModifiedAt}</Label>,
      <span data-bdd={`ActivityHistoryItem-paymentPlan-created`}>
        {formatting.formatDate(lastModifiedAt, formatting.dateTimeFormat)}
        {' - '}
        <Label>{labels.lastModifiedBy}: </Label> {lastModifiedBy}
      </span>,
    ],
    [
      <Label>{labels.description}</Label>,
      <span data-bdd={`ActivityHistoryItem-paymentPlan-modified`}>{description}</span>,
    ],
  ];

  if (endDate) {
    dataTable.splice(3, 0, [
      <Label>{labels.endDate}</Label>,
      <span data-bdd={`ActivityHistoryItem-paymentPlan-endDate`}>
        {formatting.formatDate(endDate, formatting.dateTimeFormat)}
      </span>,
    ]);
  }

  return (
    <div>
      <Title>{labels.heading}</Title>
      <Table
        addExtraTd={false}
        data-bdd="ActivityHistoryItemTable"
        data={dataTable}
        striped
        tdWrap
        topAlign
      />
    </div>
  );
};

PaymentPlan.propTypes = {
  description: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  installment: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    period: PropTypes.number.isRequired,
    schedule: PropTypes.string.isRequired,
  }).isRequired,
  labels: PropTypes.shape({
    contactName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    installmentAmount: PropTypes.string.isRequired,
    installmentFrequency: PropTypes.string.isRequired,
    installmentPeriod: PropTypes.string.isRequired,
    lastModifiedAt: PropTypes.string.isRequired,
    lastModifiedBy: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  lastModifiedAt: PropTypes.string.isRequired,
  lastModifiedBy: PropTypes.string.isRequired,
  originalType: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default PaymentPlan;
