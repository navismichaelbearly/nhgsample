import { formatting } from 'nhh-styles';
import { connect } from 'react-redux';
import path from 'ramda/src/path';
import format from 'string-format';
import uuid from 'uuid/v4';
import InteractionsStatic from '../../constants/interactions';
import partyTypeEnum from '../../constants/partyTypeEnum';
import { addNotification } from '../../ducks/notifications';
import {
  clearInteractionError,
  createInteraction,
  getActivityTypes,
  getThirdPartiesContact,
} from '../../ducks/interactions';
import { updateRibbon } from '../../ducks/ribbon';
import { getTenancy } from '../../ducks/tenancy';
import getHelpers from '../../util/stateHelpers';
import constructDateFromTimeAndDate from '../../util/constructDateFromTimeAndDate';
import generateTimeSlots from '../../util/generateTimeSlots';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs, getString } = getHelpers(state);
  const activityTypes = get(['interactions', 'activityTypes']);
  const isLoading = get(['interactions', 'loading']);
  const arrears = get(['arrears', 'items']);
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const addInteractionHeading = getString(['interaction', 'addInteraction']);
  const arrearsDetailsHeading = getString(['arrearsDetails', 'heading']);
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);

  const formatRedirectUrl = (pageURL = '') => `/arrears-details/${arrearsId}${pageURL}`;

  const redirectToPage = pageURL =>
    pageURL ? ownProps.history.push(formatRedirectUrl(pageURL)) : redirectToDetailsPage();

  const redirectToMediaPage = (interactionId, returnUrl) =>
    ownProps.history.push(
      `/arrears-details/${arrearsId}/interaction/${interactionId}/attachments?redirectTo=${formatRedirectUrl(
        returnUrl
      )}`
    );

  const arrear = arrears.find(x => x.id === arrearsId) || {};
  const tenancyId = arrear.tenancyId;
  const tenants = get(['tenancy', 'tenants']);

  const timeSlots = generateTimeSlots('00:00', '23:55');

  const mappedTenants = tenants.map(({ firstName, contactId, lastName }) => ({
    name: `${firstName} ${lastName}`,
    id: contactId,
  }));

  return {
    activityTypes,
    arrearsId,
    breadcrumb: getBreadcrumbs(
      addInteractionHeading,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    addInteractionHeading,
    error: get(['interactions', 'error']),
    errorText: getString(['interaction', 'errorText']),
    formError: getString(['interaction', 'errorText', 'formError']),
    fromPartyId: get(['user', 'profile', 'id']),
    fromPartyType: partyTypeEnum.SystemUser,
    isLoading,
    labels: getString(['interaction', 'labels']),
    notification: getString(['interaction', 'notification']),
    redirectToDetailsPage,
    redirectToMediaPage,
    redirectToPage,
    tenancyId,
    tenants: mappedTenants,
    timeSlots,
    toPartyType: partyTypeEnum.Contact,
    thirdParty: {
      thirdPartyLabel: getString(['thirdPartyUppercase']),
      thirdParties: get(['interactions', 'thirdParties']),
      thirdPartiesError: get(['interactions', 'thirdPartiesError']),
      thirdPartyErrorText: getString(['thirdPartyErrorText']),
    },
    ...InteractionsStatic,
  };
};

export const mergeProps = (
  {
    arrearsId,
    breadcrumb,
    addInteractionHeading,
    fromPartyId,
    fromPartyType,
    notification,
    redirectToDetailsPage,
    redirectToPage,
    redirectToMediaPage,
    tenancyId,
    toPartyType,
    thirdParty,
    ...stateProps
  },
  { dispatch },
  ownProps
) => ({
  ...stateProps,
  clearError: () => dispatch(clearInteractionError()),
  thirdParty: {
    ...thirdParty,
    getThirdParties: () => dispatch(getThirdPartiesContact()),
  },
  getActivityTypes: () => dispatch(getActivityTypes()),
  getTenantDetails: () => (tenancyId ? dispatch(getTenancy(tenancyId)) : null),
  onBack: () => redirectToDetailsPage(),
  onSubmit: async (payload, redirectTo, wantsToAttachMedia) => {
    const { activityKind, date, description, interactingParty, interactionType, time } = payload;

    const fromParty = {
      partyId: fromPartyId,
      partyType: fromPartyType,
    };

    const toParty = {
      partyId: interactingParty,
      partyType: toPartyType,
    };

    const inbound = !!(activityKind === 'Inbound');

    const interactionId = uuid();

    const formPayload = {
      id: interactionId,
      activityTime: constructDateFromTimeAndDate(date, time),
      activityType: interactionType.replace(' ', ''),
      description,
      subject: 'Arrears Interaction',
      inbound,
      from: inbound ? toParty : fromParty,
      to: inbound ? fromParty : toParty,
    };

    dispatch(createInteraction(arrearsId, formPayload)).then(() => {
      const notificationLines = [
        {
          dataBdd: 'interactionArrangement',
          text: format(notification.line1, {
            type: interactionType,
            kind: activityKind,
            date: formatting.formatDate(date),
            time,
          }),
        },
      ];

      dispatch(
        addNotification({
          dataBddPrefix: 'createInteraction',
          lines: notificationLines,
          hideCloseButton: true,
          icon: 'success',
          notificationType: 'confirmation',
          title: notification.createInteractionTitle,
        })
      );

      if (wantsToAttachMedia) {
        redirectToMediaPage(interactionId, redirectTo);
      } else {
        redirectToPage(redirectTo);
      }
    });
  },
  updatePageHeader: () => dispatch(updateRibbon({ title: addInteractionHeading, breadcrumb })),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
