import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import format from 'string-format';
import path from 'ramda/src/path';
import { formatting, PanelListItem, Typography } from 'nhh-styles';

import { Highlight, Label, P, Wrapper } from './components';

const renderLegalAction = ({ expiringSoon, expiryDate, labels }) => (action, bdd) => (
  <PanelListItem
    alert={action.notifyOfPendingExpiry}
    dataBdd={bdd}
    title={action.title}
    href={path(['referralPack', 'legalReferralPack', 'link'], action)}
  >
    <P>
      {!!action.expiryDate && (
        <Fragment>
          <Highlight isExpiring={!!action.notifyOfPendingExpiry}>
            <Label>{labels.expires}</Label>{' '}
            <span data-bdd={`${bdd}-expiry-date`}>
              {format(expiryDate, {
                date: formatting.formatDate(action.expiryDate),
                alert: action.notifyOfPendingExpiry ? expiringSoon : '',
              })}
            </span>
          </Highlight>
          <br />
        </Fragment>
      )}
      {!!action.createdOn && (
        <Fragment>
          <Label>{labels.createdOn}</Label>{' '}
          <span data-bdd={`${bdd}-created-on`}>{formatting.formatDate(action.createdOn)}</span>
          <br />
        </Fragment>
      )}
      {!!action.status && (
        <Fragment>
          <Label>{labels.status}</Label> <span data-bdd={`${bdd}-status`}>{action.status}</span>
          <br />
        </Fragment>
      )}
      {!!path(['raisedBy', 'name'], action) && (
        <Fragment>
          <Label>{labels.owner}</Label>{' '}
          <span data-bdd={`${bdd}-owner`}>{path(['raisedBy', 'name'], action)}</span>
          <br />
        </Fragment>
      )}
    </P>
  </PanelListItem>
);

const LegalActions = ({ heading, legalReferral, primaryLegalAction, ...props }) => {
  const renderAction = renderLegalAction(props);
  return (
    <Fragment>
      <Typography.H3>{heading}</Typography.H3>
      <Wrapper>
        {!!primaryLegalAction && renderAction(primaryLegalAction, 'primaryLegalAction')}
        {!!legalReferral && renderAction(legalReferral, 'legalReferral')}
      </Wrapper>
    </Fragment>
  );
};

export const legalActionsPropTypes = {
  expiringSoon: PropTypes.string.isRequired,
  expiryDate: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  labels: PropTypes.shape({
    createdOn: PropTypes.string.isRequired,
    expires: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export const referralPackPropTypes = {
  legalReferralPack: PropTypes.shape({
    link: PropTypes.string.isRequired,
  }).isRequired,
};

export const legalActionPropTypes = {
  createdOn: PropTypes.string.isRequired,
  expiryDate: PropTypes.string,
  headingExpiring: PropTypes.string,
  notifyOfPendingExpiry: PropTypes.bool,
  raisedBy: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  referralPack: PropTypes.shape(referralPackPropTypes),
  title: PropTypes.string.isRequired,
};

LegalActions.defaultProps = {
  legalReferral: null,
  primaryLegalAction: null,
};

LegalActions.propTypes = {
  ...legalActionsPropTypes,
  legalReferral: PropTypes.shape(legalActionPropTypes),
  primaryLegalAction: PropTypes.shape(legalActionPropTypes),
};

export default LegalActions;
