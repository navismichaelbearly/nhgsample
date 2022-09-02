export const GENERIC_LEGAL_REFERRAL = 'LegalReferral';
export const ACTIVITY_LEGAL_REFERRAL = 'Legal Referral';

export const status = Object.freeze({
  requiresApproval: 'CourtPackRequiresHomApproval',
  complete: 'Complete',
  pendingSubmission: 'CourtPackRequiresHoApproval',
  requiresSubmission: 'HeaderDocRequiresSubmission',
  canceled: 'Cancelled',
  rejected: 'HeaderDocRejected',
});

export const LRF_STATUS = Object.freeze({
  FAILED_FATAL: 'FailedFatal',
  FAILED_RETRIABLE: 'FailedRetriable',
  SUCCESS: 'Success',
});

export default status;
