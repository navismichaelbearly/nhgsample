import React from 'react';
import PropTypes from 'prop-types';
import { formatting, Table } from 'nhh-styles';

import { paymentLabelsPropType } from '../../compositions/ActivityHistoryItem';
import { Label, Title } from './components';

const Payment = ({
  caseSubType,
  createdBy,
  createdOn,
  dateOfFirstPayment,
  labels,
  paymentEndDate,
  paymentFrequency,
  paymentValue,
  status,
}) => {
  const isOneOffPayment = caseSubType === 'CardPayment';

  const frequency = [];
  if (paymentFrequency) {
    frequency.push([
      <Label>{labels.paymentFrequency}</Label>,
      <span data-bdd={`ActivityHistoryItem-payment-paymentFrequency`}>
        {labels.frequency[paymentFrequency]}
      </span>,
    ]);
  }

  const firstPayment = [];
  if (dateOfFirstPayment) {
    firstPayment.push([
      <Label>{labels.firstPayment}</Label>,
      <span data-bdd={`ActivityHistoryItem-payment-dateOfFirstPayment`}>
        {formatting.formatDate(dateOfFirstPayment, formatting.dateTimeFormat)}
      </span>,
    ]);
  }

  const endDate = [];
  if (paymentEndDate) {
    endDate.push([
      <Label>{labels.endDate}</Label>,
      <span data-bdd={`ActivityHistoryItem-payment-paymentEndDate`}>
        {formatting.formatDate(paymentEndDate, formatting.dateTimeFormat)}
      </span>,
    ]);
  }

  const dataTable = [
    [
      <Label>{labels.paymentMethod}</Label>,
      <span data-bdd={`ActivityHistoryItem-payment-paymentMethod`}>{labels[caseSubType]}</span>,
    ],
    [
      <Label>{labels.createdOn}</Label>,
      <span data-bdd={`ActivityHistoryItem-payment-createdOn`}>
        {formatting.formatDate(createdOn, formatting.dateTimeFormat)}
      </span>,
    ],
    [
      <Label>{labels.createdBy}</Label>,
      <span data-bdd={`ActivityHistoryItem-payment-createdBy`}>{createdBy.displayName}</span>,
    ],
    [
      <Label>{labels.paymentStatus}</Label>,
      <span data-bdd={`ActivityHistoryItem-payment-paymentStatus`}>{status}</span>,
    ],
    [
      <Label>{labels[isOneOffPayment ? 'paymentAmount' : 'instalmentAmount']}</Label>,
      <span data-bdd={`ActivityHistoryItem-payment-paymentAmount`}>
        {formatting.formatCurrency(paymentValue)}
      </span>,
    ],
    ...frequency,
    ...firstPayment,
    ...endDate,
  ];

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

Payment.defaultProps = {
  dateOfFirstPayment: null,
  paymentEndDate: null,
  paymentFrequency: null,
};

Payment.propTypes = {
  caseSubType: PropTypes.string.isRequired,
  createdBy: PropTypes.shape({
    displayName: PropTypes.string.isRequired,
  }).isRequired,
  createdOn: PropTypes.string.isRequired,
  labels: PropTypes.shape(paymentLabelsPropType).isRequired,
  paymentValue: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  dateOfFirstPayment: PropTypes.string,
  paymentEndDate: PropTypes.string,
  paymentFrequency: PropTypes.string,
};

export default Payment;
