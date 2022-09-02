import { connect } from 'react-redux';
import path from 'ramda/src/path';
import format from 'string-format';

import getInternalRoutes from '../../constants/internalRoutes';
import getHelpers from '../../util/stateHelpers';
import { payments } from '../../constants/routes';
import { ACTIVE, DRAFT } from '../../constants/pause';
import { SYSTEM_PAUSED } from '../../constants/arrears';

export const mapStateToProps = (state, ownProps) => {
  const { get } = getHelpers(state);
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const arrears = get(['arrears', 'items']);
  const currentArrear = arrears.find(arrear => arrear.id === arrearsId) || {};
  const isArrearSystemPaused = currentArrear.status && currentArrear.status === SYSTEM_PAUSED;
  const isManager = get(['user', 'userType']) === 'manager';
  const userRoles = get(['user', 'roles']);

  const internalRouter = getInternalRoutes(currentArrear, isManager);

  const {
    addNote: { addNote },
    addTask: { addTask },
    correspondence: { sendCorrespondence },
    interaction: { addInteraction },
    legalCaseReferral: { create, review },
    pauseArrearsCase: { pauseArrearsCase, reviewPauseRequest, updatePauseRequest },
    paymentPlan: { createPaymentPlan, viewPaymentPlan },
    referArrearsCase: { heading2: tenancySustainmentReferral },
    // serveNosp: { serveNospEarly },
    takePayment: { takePayment },
  } = state.dictionary;

  // NOSP button
  const serveNosp = currentArrear.canServeNosp
    ? [
        // temporarily removed
        // {
        //   dataBdd: 'serveNosp',
        //   text: serveNospEarly,
        //   link: internalRouter.arrearsDetailNOSPModal,
        // },
      ]
    : [];

  // Pause button
  const pauses = path(['pauseSummary'], currentArrear) || [];
  const pauseAwaitingApproval = pauses.filter(pause => pause.status === DRAFT)[0];
  const activePause = pauses.filter(pause => pause.status === ACTIVE)[0] || pauseAwaitingApproval;
  let pauseButtontext = activePause ? updatePauseRequest : pauseArrearsCase;
  if (pauseAwaitingApproval && isManager) {
    pauseButtontext = reviewPauseRequest;
  }

  const pauseRequest = isArrearSystemPaused
    ? []
    : [
        {
          dataBdd: 'pauseArrearsCase',
          text: pauseButtontext,
          link: internalRouter.pause,
        },
      ];

  // Legal referral button
  const canCreateLegalReferral = path(
    ['legalReferralCase', 'canCreateLegalReferral'],
    currentArrear
  );
  const longName = path(['legalReferralCase', 'formName'], currentArrear);
  const legalReferralActionName = longName && longName.split('|')[0].trim();
  const currentLegalReferralAction = path(['legalReferral', 'caseId'], currentArrear);
  const isSeniorManager = userRoles.includes('SeniorManager');

  let legalActionsButton;

  if (legalReferralActionName && canCreateLegalReferral) {
    if (currentLegalReferralAction) {
      legalActionsButton = isSeniorManager
        ? []
        : [
            {
              dataBdd: 'legalCaseReferral',
              text: format(review, {
                type: legalReferralActionName,
              }),
              link: internalRouter.legalReferral,
            },
          ];
    } else {
      legalActionsButton = isSeniorManager
        ? []
        : [
            {
              dataBdd: 'legalCaseReferral',
              text: format(create, {
                type: legalReferralActionName,
              }),
              link: internalRouter.legalReferral,
            },
          ];
    }
  } else {
    legalActionsButton = [];
  }

  return {
    actions: [
      {
        dataBdd: 'addInteraction',
        text: addInteraction,
        link: internalRouter.interaction,
      },
      {
        dataBdd: 'sendCorrespondence',
        text: sendCorrespondence,
        link: internalRouter.sendCorrespondence,
      },
      ...serveNosp,
      {
        dataBdd: 'takePayment',
        text: takePayment,
        href: `${payments}/setup-payment?tenancyId=${currentArrear.tenancyId}&arrearsId=${currentArrear.id}`,
      },
      {
        dataBdd: 'paymentPlan',
        text: !currentArrear.paymentPlan ? createPaymentPlan : viewPaymentPlan,
        link: internalRouter.paymentPlan,
      },
      {
        dataBdd: 'tenancySustainmentReferral',
        text: tenancySustainmentReferral,
        link: internalRouter.tenancySustainmentReferral,
      },
      {
        dataBdd: 'addTask',
        text: addTask,
        link: internalRouter.addTask,
      },
      {
        dataBdd: 'addNote',
        text: addNote,
        link: internalRouter.addNote,
      },
      ...pauseRequest,
      ...legalActionsButton,
    ],
  };
};

export default connect(mapStateToProps);
