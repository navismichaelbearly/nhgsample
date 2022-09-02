import React, { Fragment } from 'react';
import format from 'string-format';
import { formatting } from 'nhh-styles';

import { installmentArrangement } from '../../util/paymentPlan';
import { formatBoolean } from '../../util/formatBoolean';

import { Label } from '../Common';

export const getPauseDetails = (pause, labels, type) => {
  if (pause) {
    return (
      <Fragment>
        {format(labels.pauses[type === 'draft' ? 'draftPausePeriod' : 'pausePeriod'], {
          from: formatting.formatDate(pause.startDate),
          to: formatting.formatDate(pause.expiryDate),
        })}
        {type !== 'draft' && pause.isExtended ? (
          <Label>{` ${labels.pauses.isExtended}`}</Label>
        ) : null}
      </Fragment>
    );
  }
  return labels.none;
};

export const getPaymentPlanDetails = (plan, labels) => (
  <Fragment>
    <Label>{labels.paymentPlan.startDate}</Label> {formatting.formatDate(plan.startDate)}
    <br />
    <Label>{labels.paymentPlan.endDate}</Label> {formatting.formatDate(plan.endDate)}
    <br />
    <Label>{labels.paymentPlan.installment}</Label>{' '}
    {installmentArrangement(
      labels.installmentArrangementFormat,
      plan.installment.amount,
      plan.installment.period,
      formatting.formatDate(plan.startDate),
      plan.installment.schedule
    )}
    <br />
    <Label>{labels.paymentPlan.type}</Label> {plan.type}
  </Fragment>
);

export const getUniversalCreditDetails = (welfareReform, labels) => {
  const universalCredit = welfareReform ? formatBoolean(welfareReform.universalCredit) : '';
  const benefitCap = welfareReform ? formatBoolean(welfareReform.benefitCap) : '';
  const bedroomTax = welfareReform ? formatBoolean(welfareReform.bedroomTax) : '';
  const apaStatus = welfareReform ? welfareReform.apaStatusDescription : '';
  const apaStatusDescription = apaStatus ? (
    <Fragment>
      <Label>{labels.welfareReform.apaStatus}</Label> {apaStatus}
      <br />
    </Fragment>
  ) : (
    ''
  );
  const ucArrearsPaymentStatus = welfareReform
    ? welfareReform.ucArrearsPaymentStatusDescription
    : '';
  const ucArrearsPaymentStatusDescription = ucArrearsPaymentStatus ? (
    <Fragment>
      <Label>{labels.welfareReform.ucArrearsPaymentStatus}</Label> {ucArrearsPaymentStatus}
      <br />
    </Fragment>
  ) : (
    ''
  );
  const claimStartDate = welfareReform ? welfareReform.claimStartDate : '';
  const claimStartDateWithLabel =
    claimStartDate !== null ? (
      <Fragment>
        <Label>{labels.welfareReform.claimStartDate}</Label> {formatting.formatDate(claimStartDate)}
        <br />
      </Fragment>
    ) : (
      ''
    );
  const paymentDay = welfareReform ? welfareReform.paymentDay : '';
  const paymentDayWithLabel =
    paymentDay !== null ? (
      <Fragment>
        <Label>{labels.welfareReform.paymentDay}</Label> {paymentDay}
        <br />
      </Fragment>
    ) : (
      ''
    );
  return (
    <Fragment>
      <Label>{labels.welfareReform.universalCredit}</Label> {universalCredit}
      <br />
      {universalCredit === 'Yes' && (
        <Fragment>
          {claimStartDateWithLabel}
          {paymentDayWithLabel}
          {apaStatusDescription}
          {ucArrearsPaymentStatusDescription}
        </Fragment>
      )}
      <Label>{labels.welfareReform.benefitCap}</Label> {benefitCap}
      <br />
      <Label>{labels.welfareReform.bedroomTax}</Label> {bedroomTax}
      <br />
    </Fragment>
  );
};
