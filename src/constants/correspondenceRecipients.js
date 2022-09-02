const recipients = Object.freeze([
  { name: 'Customer(s)', value: 'customer' },
  { name: 'Third party', value: 'thirdparty' },
]);

export const CUSTOMER = recipients[0].name;
export const THIRD_PARTY = recipients[1].name;

export default recipients;
