import { ACTIVE, DRAFT } from './pause';
import { isUserSeniorManager } from '../util/userRoles';
import legalReferralStatus, { status as legalReferralCaseStatus } from './legalReferral';

export const getActivityHistoryItemRoute = (arrearsId, itemId) =>
  `/arrears-details/${arrearsId || ':arrearsId'}/history/${itemId || ':itemId'}`;

export const getArrearsDetailRoute = arrearsId => `/arrears-details/${arrearsId || ':arrearsId'}`;

export const getArchivedTasksRoute = arrearsId =>
  `/arrears-details/${arrearsId || ':arrearsId'}/archived-tasks`;

export const getLegalReferralLink = ({
  arrearsId,
  legalReferralId,
  canCreateLegalReferral,
  status,
  userRoles,
}) => {
  const noLink = () => '';
  // pre-condition
  if (!arrearsId) {
    return noLink();
  }
  // helpers
  const prependedURL = `/arrears-details/${arrearsId}`;
  const reviewLink = () => `${prependedURL}/legal-case-referral/${legalReferralId}/review`;
  const approveLink = () => `${prependedURL}/legal-case-referral/${legalReferralId}/approve`;
  const createLink = () => `${prependedURL}/legal-case-referral/create`;
  const isLoggedUserSeniorManager = isUserSeniorManager(userRoles);
  // Legal Referral Task
  if (!legalReferralId) {
    if (canCreateLegalReferral && !isLoggedUserSeniorManager) {
      return createLink();
    }
    return noLink();
  }
  // Owner Sign-Off Task
  if (status === legalReferralCaseStatus.pendingSubmission) {
    if (isLoggedUserSeniorManager) {
      return approveLink();
    }
    return reviewLink();
  }
  // Manager Sign-Off
  if (status === legalReferralCaseStatus.requiresApproval) {
    return approveLink();
  }
  return reviewLink();
};

export const getTaskActivityRouteByActionType = ({
  actionType,
  arrearsId,
  legalReferral = {
    legalReferralId: '',
    canCreateLegalReferral: false,
    status: '',
    userRoles: [],
  },
}) => {
  const prependedURL = `/arrears-details/${arrearsId}`;
  switch (actionType) {
    case 'addinteraction': {
      return `${prependedURL}/interaction/create`;
    }
    case 'addnote': {
      return `${prependedURL}/note/create`;
    }
    case 'sendcorrespondence': {
      return `${prependedURL}/send-correspondence/create`;
    }
    case 'legalreferral': {
      return getLegalReferralLink({
        arrearsId,
        legalReferralId: legalReferral.legalReferralId,
        canCreateLegalReferral: legalReferral.canCreateLegalReferral,
        status: legalReferral.status,
        userRoles: legalReferral.userRoles,
      });
    }
    default: {
      return '#';
    }
  }
};

export default (
  { id: arrearsId, legalReferral: lr, legalReferralCase, pauseSummary, paymentPlan: pp },
  isManager
) => {
  // paymentPlan routing conditions
  const paymentPlanId = pp ? pp.id : null;

  // pause routing conditions
  const pauses = pauseSummary || [];
  const pauseAwaitingApproval = pauses.find(pause => pause.status === DRAFT);
  const activePause = pauses.find(pause => pause.status === ACTIVE);
  const currentPause = pauseAwaitingApproval || activePause || {};
  let pauseAction;
  if (currentPause.id) pauseAction = 'update';
  if (pauseAwaitingApproval && isManager) pauseAction = 'approve';

  // legalReferral routing conditions
  const legalReferralActionStatus = legalReferralCase ? legalReferralCase.status : null;
  const currentLegalReferralAction = lr ? lr.caseId : null;
  const legalReferralActionType =
    legalReferralActionStatus === legalReferralStatus.requiresApproval ? 'approve' : 'review';

  const linkToPage = (type, typeId, action) =>
    `/arrears-details/${arrearsId}/${type}/${typeId || 'create'}${
      typeId && action ? `/${action}` : ''
    }`;

  return {
    addNote: linkToPage('note'),
    addTask: linkToPage('task'),
    arrearsDetailNOSPModal: `/arrears-details/${arrearsId}?modal=serveNOSP`,
    interaction: linkToPage('interaction'),
    legalReferral: linkToPage(
      'legal-case-referral',
      currentLegalReferralAction,
      legalReferralActionType
    ),
    pause: linkToPage('pause-arrears-case', currentPause.id, pauseAction),
    paymentPlan: linkToPage('payment-plan', paymentPlanId),
    sendCorrespondence: linkToPage('send-correspondence'),
    tenancySustainmentReferral: linkToPage('refer-arrears-case'),
    welfareReformDetails: `/arrears-details/${arrearsId}/welfare-reform-details`,
  };
};
