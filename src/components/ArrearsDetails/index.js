import React from 'react';
import PropTypes from 'prop-types';
import format from 'string-format';
import { formatting, Table, tap, LinkedCasesList } from 'nhh-styles';
import has from 'ramda/src/has';
import isEmpty from 'ramda/src/isEmpty';

import { getPauseDetails, getPaymentPlanDetails, getUniversalCreditDetails } from './selectors';
import { Label, Wrapper, Heading, LabelLink } from '../Common';

import getInternalRoutes from '../../constants/internalRoutes';
import { DRAFT, ACTIVE } from '../../constants/pause';

const getTableData = (labels, props) => {
  const {
    arrearsLength,
    createdOn,
    welfareReform,
    owner,
    pauseSummary,
    paymentPlan,
    linkedCaseIds,
    rentDetail,
    status,
    workwiseReferenceNumber,
  } = props;
  const internalRouter = getInternalRoutes({ ...props });

  const PaymentPlanLabel = paymentPlan ? LabelLink : Label;
  const WelfareReformLabel = welfareReform ? LabelLink : Label;
  const pause = pauseSummary.find(item => item.status === ACTIVE);
  const draftPause = pauseSummary.find(item => item.status === DRAFT);
  const PauseLabel = pause ? LabelLink : Label;
  const DraftPauseLabel = draftPause ? LabelLink : Label;
  const hasRentProp = property =>
    tap(rentDetail && has(property, rentDetail), () => rentDetail[property]);

  const returnArray = [
    [
      <Label>{labels.patchOwner}</Label>,
      <span data-bdd="ArrearsDetails-patchOwner">{owner.name}</span>,
    ],
    [<Label>{labels.status}</Label>, <span data-bdd="ArrearsDetails-status">{status}</span>],
    [
      <Label>{labels.workwiseReference}</Label>,
      <span data-bdd="ArrearsDetails-workwiseReference">{workwiseReferenceNumber}</span>,
    ],
    [
      <Label>{labels.lengthOfArrears}</Label>,
      <span data-bdd="ArrearsDetails-lengthOfArrears">
        {format(labels.lengthOfArrearsValue, {
          days: arrearsLength,
          date: formatting.formatDate(createdOn),
        })}
      </span>,
    ],
    [
      <Label>{labels.rentDetails.paymentReferenceNumber}</Label>,
      <span data-bdd="ArrearsDetails-paymentReferenceNumber">
        {hasRentProp('paymentReference') || labels.none}
      </span>,
    ],
    [
      <Label>
        {format(labels.rentDetails.collectionRate.label, {
          value: labels.rentDetails.collectionRate.value5w,
        })}
      </Label>,
      <span data-bdd="ArrearsDetails-paymentCollectionRate5w">
        {tap(hasRentProp('collectionRate5Weeks'), val =>
          format(labels.rentDetails.collectionRate.value, {
            value: val,
          })
        ) || labels.none}
      </span>,
    ],
    [
      <Label>
        {format(labels.rentDetails.collectionRate.label, {
          value: labels.rentDetails.collectionRate.value4m,
        })}
      </Label>,
      <span data-bdd="ArrearsDetails-paymentCollectionRate4m">
        {tap(hasRentProp('collectionRate4Months'), val =>
          format(labels.rentDetails.collectionRate.value, {
            value: val,
          })
        ) || labels.none}
      </span>,
    ],
    [
      <Label>{labels.rentDetails.grossRent.label}</Label>,
      <span data-bdd="ArrearsDetails-grossPayment">
        {tap(hasRentProp('grossRent'), formatting.formatCurrency) || labels.none}
      </span>,
    ],
    ...(tap(hasRentProp('charges'), charges =>
      charges.map(charge => [
        <Label>{charge.description}</Label>,
        <span data-bdd={`ArrearsDetails-charge-${charge.description}`}>
          {formatting.formatCurrency(charge.chargeValue)}
        </span>,
      ])
    ) || []),
    [
      <Label>{labels.rentDetails.paymentFrequency}</Label>,
      <span data-bdd="ArrearsDetails-paymentReferenceNumber">
        {rentDetail ? rentDetail.paymentFrequency : labels.none}
      </span>,
    ],
    [
      <Label>{labels.rentDetails.arrearsBalance}</Label>,
      <span data-bdd="ArrearsDetails-arrearsCurrentBalance">
        {tap(hasRentProp('currentBalance'), val =>
          formatting.formatCurrency(val === 0 ? 0 : val * -1)
        ) || labels.none}
      </span>,
    ],
    [
      <PaymentPlanLabel isText to={internalRouter.paymentPlan}>
        {labels.paymentPlan.label}
      </PaymentPlanLabel>,
      <span data-bdd="ArrearsDetails-paymentPlan">
        {paymentPlan ? getPaymentPlanDetails(paymentPlan, labels) : labels.none}
      </span>,
    ],
    [
      <PauseLabel isText to={internalRouter.pause}>
        {labels.pauses.label}
      </PauseLabel>,
      <span data-bdd="ArrearsDetails-pauses">{getPauseDetails(pause, labels)}</span>,
    ],
    [
      <DraftPauseLabel isText to={internalRouter.pause}>
        {labels.pauses.draftLabel}
      </DraftPauseLabel>,
      <span data-bdd="ArrearsDetails-draftPauses">
        {getPauseDetails(draftPause, labels, 'draft')}
      </span>,
    ],
    [
      <Label>{labels.linkedCases}</Label>,
      <span data-bdd="ArrearsDetails-linkedCases">
        {linkedCaseIds ? (
          <LinkedCasesList links={linkedCaseIds} bdd="LinkedCases" linkedCases />
        ) : (
          labels.none
        )}
      </span>,
    ],
    [
      <WelfareReformLabel isText to={internalRouter.welfareReformDetails}>
        {labels.welfareReform.label}
      </WelfareReformLabel>,
      <span data-bdd="ArrearsDetail-universal">
        {!isEmpty(welfareReform) ? getUniversalCreditDetails(welfareReform, labels) : 'None'}
      </span>,
    ],
  ];

  return returnArray;
};

const ArrearsDetails = ({ heading, labels, ...props }) => (
  <Wrapper>
    <Heading>{heading}</Heading>
    <Table
      addExtraTd={false}
      addExtraTh={false}
      data-bdd="ArrearsDetailsTable"
      data={getTableData(labels, props)}
      striped
      tdWrap
      topAlign
    />
  </Wrapper>
);

export const detailsPropTypes = {
  createdOn: PropTypes.string.isRequired,
  owner: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
    type: PropTypes.string,
  }),
  pauseSummary: PropTypes.arrayOf(
    PropTypes.shape({
      expiryDate: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ),
  paymentPlan: PropTypes.shape({
    endDate: PropTypes.string.isRequired,
    installment: PropTypes.shape({
      amount: PropTypes.number.isRequired,
      period: PropTypes.number.isRequired,
      schedule: PropTypes.string.isRequired,
    }).isRequired,
    startDate: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
  status: PropTypes.string.isRequired,
  arrearsLength: PropTypes.number,
  linkedCaseIds: PropTypes.array,
  welfareReform: PropTypes.shape({
    universalCredit: PropTypes.string,
  }),
  workwiseReferenceNumber: PropTypes.string,
};

export const labelPropTypes = {
  lengthOfArrears: PropTypes.string.isRequired,
  none: PropTypes.string.isRequired,
  patchOwner: PropTypes.string.isRequired,
  pauses: PropTypes.shape({
    active: PropTypes.string.isRequired,
    draftLabel: PropTypes.string.isRequired,
    draftPausePeriod: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    pausePeriod: PropTypes.string.isRequired,
    pendingApproval: PropTypes.string.isRequired,
  }).isRequired,
  paymentPlan: PropTypes.shape({
    endDate: PropTypes.string.isRequired,
    frequency: PropTypes.string.isRequired,
    instalmentAmount: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  status: PropTypes.string.isRequired,
  welfareReform: PropTypes.shape({
    universalCredit: PropTypes.string,
  }),
  workwiseReference: PropTypes.string.isRequired,
};

ArrearsDetails.defaultProps = {
  linkedCaseIds: undefined,
  paymentPlan: null,
  pauseSummary: [],
  welfareReform: null,
};

ArrearsDetails.propTypes = {
  ...detailsPropTypes,
  heading: PropTypes.string.isRequired,
  labels: PropTypes.shape(labelPropTypes).isRequired,
  welfareReform: PropTypes.object,
};

export default ArrearsDetails;
