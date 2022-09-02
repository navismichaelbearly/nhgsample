import { connect } from 'react-redux';
import path from 'ramda/src/path';

import { setModalContent } from '../../ducks/modal';
import { patchCustomerProfileReset, updateCustomerProfile } from '../../ducks/customer';
import { patchTenant } from '../../ducks/tenancy';

export const mapStateToProps = state => {
  const {
    customer,
    dictionary: {
      propertyInformation: { editDetailsHeading, editDetailsSubheading, errorMessages, labels },
    },
  } = state;

  return {
    errorMessages,
    heading: editDetailsHeading,
    labels,
    subheading: editDetailsSubheading,
    tenantUpdateStatus: path(['profile', 'updateStatus'], customer),
    isLoading: path(['profile', 'loading'], customer),
  };
};

export const mergeProps = (stateProps, { dispatch }, ownProps) => ({
  ...stateProps,
  onCancel: () => dispatch(setModalContent()),
  onSubmit: (id, details) =>
    dispatch(updateCustomerProfile(id, details)).then(() => {
      dispatch(
        patchTenant({
          ...details,
          contactId: id,
        })
      );
    }),
  onUnmount: () => dispatch(patchCustomerProfileReset()),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
