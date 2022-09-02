import { connect } from 'react-redux';
import getHelpers from '../../util/stateHelpers';

export const mapStateToProps = state => {
  const { dictionary, get } = getHelpers(state);
  const { currencySymbol, transactionHistory } = dictionary;
  const customerAccounts = get(['customer', 'accounts'], []);
  const mainTenantPartyId = get(['tenancy', 'tenants', 0, 'partyIdentifier'], '');
  return {
    transactionHistoryText: {
      currencySymbol,
      ...transactionHistory,
    },
    customerAccounts,
    partyIdentifier: mainTenantPartyId,
  };
};

export default connect(mapStateToProps, null);
