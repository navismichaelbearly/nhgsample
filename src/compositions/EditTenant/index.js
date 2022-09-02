import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditContactDetails, Loader } from 'nhh-styles';

import { showConfirmationKey, errorKey } from '../../constants/statusKeys';

import connect from './connect';

export class EditTenantComposition extends Component {
  componentWillUnmount() {
    this.props.onUnmount();
  }

  handleSubmit = (emailAddress, phoneNumber) => {
    const {
      onSubmit,
      tenant: { id },
    } = this.props;
    onSubmit(id, { emailAddress, mobileTelephoneNumber: phoneNumber });
  };

  render() {
    const {
      errorMessages: { emailAddressError, phoneNumberError, submitError },
      heading,
      labels,
      onCancel,
      subheading,
      tenant: { emailAddress, fullName, telephoneNumber },
      tenantUpdateStatus,
      isLoading,
    } = this.props;

    return isLoading ? (
      <Loader />
    ) : (
      <EditContactDetails
        {...labels}
        emailAddress={emailAddress || ''}
        errorText={submitError}
        heading={heading}
        fullName={fullName}
        phoneNumber={telephoneNumber || ''}
        emailAddressError={emailAddressError}
        emailAddressIsRequired={false}
        phoneNumberError={phoneNumberError}
        onSubmit={this.handleSubmit}
        onCancel={onCancel}
        phoneNumberIsRequired={false}
        subTitle={subheading}
        showConfirmation={tenantUpdateStatus === showConfirmationKey}
        showError={tenantUpdateStatus === errorKey}
      />
    );
  }
}

EditTenantComposition.defaultProps = {
  subheading: null,
  tenant: {},
  tenantUpdateStatus: null,
};

EditTenantComposition.propTypes = {
  errorMessages: PropTypes.shape({
    emailAddressError: PropTypes.string.isRequired,
    phoneNumberError: PropTypes.string.isRequired,
  }).isRequired,
  heading: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  labels: PropTypes.shape({
    cancelButtonText: PropTypes.string.isRequired,
    closeButtonText: PropTypes.string.isRequired,
    confirmationText: PropTypes.string.isRequired,
    emailAddressLabel: PropTypes.string.isRequired,
    errorText: PropTypes.string.isRequired,
    fullNameLabel: PropTypes.string.isRequired,
    phoneNumberLabel: PropTypes.string.isRequired,
    updateButtonText: PropTypes.string.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
  subheading: PropTypes.string,
  tenant: PropTypes.shape({
    fullName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    emailAddress: PropTypes.string,
    telephoneNumber: PropTypes.string,
  }),
  tenantUpdateStatus: PropTypes.string,
};

export default connect(EditTenantComposition);
