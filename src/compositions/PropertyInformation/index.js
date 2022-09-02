import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { PropertyInformation } from 'nhh-styles';

import connect from './connect';

export class PropertyInformationComposition extends PureComponent {
  componentDidMount() {
    this.props.getTenantDetails();
  }

  render() {
    return <PropertyInformation {...this.props} />;
  }
}

PropertyInformationComposition.defaultProps = {
  disableGlobalEdit: false,
  tenants: [],
};

PropertyInformationComposition.propTypes = {
  address: PropTypes.shape({
    line1: PropTypes.string.isRequired,
    city: PropTypes.string,
    line2: PropTypes.string,
    postcode: PropTypes.string,
  }).isRequired,
  disableGlobalEdit: PropTypes.bool.isRequired,
  getTenantDetails: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  labels: PropTypes.shape({
    address: PropTypes.string.isRequired,
    coTenant: PropTypes.string.isRequired,
    editButton: PropTypes.string.isRequired,
    emailAddress: PropTypes.string.isRequired,
    mainTenant: PropTypes.string.isRequired,
    telephoneNumber: PropTypes.string.isRequired,
  }).isRequired,
  onEditClick: PropTypes.func.isRequired,
  tenants: PropTypes.arrayOf(
    PropTypes.shape({
      fullName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      editable: PropTypes.bool,
      emailAddress: PropTypes.string,
      flags: PropTypes.arrayOf(PropTypes.node),
      telephoneNumber: PropTypes.string,
    })
  ),
};

export default withRouter(connect(PropertyInformationComposition));
