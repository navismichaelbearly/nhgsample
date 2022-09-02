import {
  COMPLETEDSTATUSCODE,
  SCHEDULEDSTATUSCODE,
  CANCELLEDSTATUSCODE,
  UPDATESTATUSCODE,
} from '../constants/pause';

const buildReplaceItem = (path, value) => ({
  op: 'replace',
  path: `/${path}`,
  value,
});

export default (action, description, paloadObj = {}) => {
  if (action === COMPLETEDSTATUSCODE) {
    return [
      buildReplaceItem('description', description),
      buildReplaceItem('statusCode', COMPLETEDSTATUSCODE),
    ];
  } else if (action === SCHEDULEDSTATUSCODE) {
    return [buildReplaceItem('statusCode', SCHEDULEDSTATUSCODE)];
  } else if (action === CANCELLEDSTATUSCODE) {
    return [
      buildReplaceItem('declineDescription', description),
      buildReplaceItem('statusCode', CANCELLEDSTATUSCODE),
    ];
  } else if (action === UPDATESTATUSCODE) {
    return [
      buildReplaceItem('statusCode', UPDATESTATUSCODE),
      buildReplaceItem('description', paloadObj.description),
      buildReplaceItem('endDate', paloadObj.endDate),
      buildReplaceItem('reasonId', paloadObj.reasonId),
      buildReplaceItem('requireManagerApproval', paloadObj.requireManagerApproval),
      buildReplaceItem('notifyManager', paloadObj.notifyManager),
    ];
  }
  return {};
};
