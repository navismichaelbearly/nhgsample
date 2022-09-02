import { permissions, userType } from '../constants/claims';

const types = [
  {
    type: 'manager',
    condition: 'ARREARS.ApprovePauseRequest',
  },
  {
    type: 'manager',
    condition: 'ARREARS.ApproveLegalReferral',
  },
];

export default (claims = {}) => {
  const userPermissions = claims[permissions] || [];

  const type = claims[userType] || '';
  const permissionsType = types.find(x => userPermissions.includes(x.condition)) || {};

  return permissionsType.type || type;
};
