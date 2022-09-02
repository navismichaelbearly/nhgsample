import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { TransactionHistoryList } from 'nhh-styles';
import { H3, P, Wrapper } from './components';
import connect from './connect';

export class TenancyTransactions extends PureComponent {
  render() {
    const { customerAccounts, transactionHistoryText } = this.props;
    if (
      !customerAccounts.length ||
      !customerAccounts.find(customerAccount => customerAccount.transactions.length)
    ) {
      return null;
    }
    return (
      <Fragment>
        <H3>{transactionHistoryText.heading}</H3>
        {customerAccounts
          .filter(customerAccount => customerAccount.transactions.length)
          .map(customerAccount => {
            const key = `transactionHistory-${
              customerAccount.typeCode + customerAccount.propertyReferenceNumber
            }`;
            return (
              <Wrapper key={key} data-bdd={key}>
                <P>{customerAccount.typeName}</P>
                <TransactionHistoryList
                  text={transactionHistoryText}
                  transactions={customerAccount.transactions}
                />
              </Wrapper>
            );
          })}
      </Fragment>
    );
  }
}

TenancyTransactions.propTypes = {
  customerAccounts: PropTypes.array.isRequired,
  transactionHistoryText: PropTypes.shape({
    amount: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    charged: PropTypes.string.isRequired,
    currencySymbol: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    effectiveDate: PropTypes.string.isRequired,
    paidIn: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(connect(TenancyTransactions));
