import { connect } from 'react-redux';
import path from 'ramda/src/path';

import getHelpers from '../../util/stateHelpers';
import { addNotification } from '../../ducks/notifications';
import { updateRibbon } from '../../ducks/ribbon';
import { addNoteToCase, clearNoteError } from '../../ducks/notes';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs } = getHelpers(state);
  const {
    addNote: { addNote, formError, notification, ...text },
    arrearsDetails: { heading: arrearsDetailsHeading },
  } = state.dictionary;

  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const returnUrl = `/arrears-details/${arrearsId}`;
  const redirectToDetailsPage = () => ownProps.history.push(returnUrl);

  const redirectToAttachmentsPage = id =>
    ownProps.history.push(`${returnUrl}/note/${id}/attachments?redirectTo=${returnUrl}`);

  return {
    addNote,
    arrearsId,
    breadcrumb: getBreadcrumbs(
      addNote,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    error: get(['notes', 'error']),
    isLoading: get(['notes', 'loading']),
    formError,
    heading: addNote,
    notification,
    redirectToDetailsPage,
    redirectToAttachmentsPage,
    ...text,
  };
};

export const mergeProps = (
  {
    arrearsId,
    breadcrumb,
    heading,
    notification,
    redirectToAttachmentsPage,
    redirectToDetailsPage,
    ...stateProps
  },
  { dispatch },
  ownProps
) => ({
  ...stateProps,
  arrearsId,
  clearError: () => dispatch(clearNoteError()),
  onBack: redirectToDetailsPage,
  onSubmit: (note, wantsToAttachFiles) =>
    dispatch(addNoteToCase(arrearsId, note))
      .then(id => {
        dispatch(
          addNotification({
            dataBddPrefix: 'addNote',
            lines: [{ text: notification.line1 }],
            icon: 'success',
            notificationType: 'confirmation',
            title: notification.title,
          })
        );

        if (wantsToAttachFiles) {
          redirectToAttachmentsPage(id);
        } else {
          redirectToDetailsPage();
        }
      })
      .catch(() => {}),
  updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
