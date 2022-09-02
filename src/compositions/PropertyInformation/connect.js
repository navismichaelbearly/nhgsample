import React from 'react';
import { connect } from 'react-redux';
import path from 'ramda/src/path';

import { employeeDashboard } from '../../constants/routes';
import { EditTenant } from '../';
import { setModalContent } from '../../ducks/modal';
import { getTenancy } from '../../ducks/tenancy';

import { Flag } from './components';

export const mapStateToProps = state => {
  const {
    arrears: { items: arrears },
    dictionary: {
      propertyInformation: { heading, labels, vulnerabilityFlag },
    },
    tenancy,
  } = state;

  return {
    address: {
      city: tenancy.addressCity,
      line1: tenancy.addressLine1 || '',
      postcode: tenancy.addressPostcode,
      line2: tenancy.addressLine2,
    },
    arrears,
    heading,
    labels,
    tenancyType: tenancy.tenancyType || labels.notAvailable,
    tenants: tenancy.tenants,
    vulnerabilityFlagLabel: vulnerabilityFlag,
  };
};

export const mergeProps = (
  { arrears, tenants, vulnerabilityFlagLabel, ...stateProps },
  { dispatch },
  ownProps
) => {
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const arrear = arrears.find(x => x.id === arrearsId) || {};
  const tenancyId = arrear.tenancyId;

  const mappedTenants = tenants.map(
    ({
      emailAddress,
      firstName,
      contactId,
      lastName,
      mobileTelephoneNumber,
      vulnerabilityFlag,
    }) => ({
      editable: true,
      emailAddress,
      flags: vulnerabilityFlag
        ? [<Flag data-bdd="tenantVulnerable">{vulnerabilityFlagLabel}</Flag>]
        : null,
      fullName: `${firstName} ${lastName}`,
      href: `${employeeDashboard}/customer/${contactId}`,
      id: contactId,
      telephoneNumber: mobileTelephoneNumber,
    })
  );

  return {
    ...stateProps,
    tenants: mappedTenants,
    getTenantDetails: () => (tenancyId ? dispatch(getTenancy(tenancyId)).catch(() => {}) : null),
    onEditClick: tenant => {
      dispatch(setModalContent(<EditTenant tenant={tenant} />));
    },
    ...ownProps,
  };
};

export default connect(mapStateToProps, null, mergeProps);
