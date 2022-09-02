import { connect } from 'react-redux';
import path from 'ramda/src/path';
import { formatting } from 'nhh-styles';
import getHelpers from '../../util/stateHelpers';
import { addNotification } from '../../ducks/notifications';
import { updateRibbon } from '../../ducks/ribbon';
import { clearTaskError, taskError, addTask as AddTaskItem } from '../../ducks/tasks';
import { clearSearch, search } from '../../ducks/housingofficersearch';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs } = getHelpers(state);
  const {
    addTask,
    addTask: { addTask: heading, notification, formError, serverError },
    arrearsDetails: { heading: arrearsDetailsHeading },
  } = state.dictionary;

  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);

  return {
    addTask,
    arrearsId,
    breadcrumb: getBreadcrumbs(
      heading,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    loading: get(['tasks', 'loading']),
    housingOfficerSearchResults: get(['housingofficersearch', 'searchResults']) || [],
    error: get(['tasks', 'error']),
    userId: get(['user', 'profile', 'id']),
    loggedInUserId: get(['user', 'profile', 'id']),
    userFullName: get(['user', 'profile', 'fullname']),
    notification,
    heading,
    redirectToDetailsPage,
    errorMessage: get(['tasks', 'isFormError']) ? formError : serverError,
  };
};

export const mergeProps = (
  {
    arrearsId,
    breadcrumb,
    heading,
    housingOfficerSearchResults,
    notification,
    redirectToDetailsPage,
    userId,
    ...stateProps
  },
  { dispatch },
  ownProps
) => ({
  ...stateProps,
  housingOfficerSearchResults,
  clearUserSearch: () => dispatch(clearSearch()),
  onBack: () => redirectToDetailsPage(),
  onDisplayFormError: () => dispatch(taskError(true)),
  onSubmit: ({ title, description, date, ownerId }) => {
    dispatch(AddTaskItem(arrearsId, title, description, date, ownerId, userId))
      .then(() => {
        dispatch(
          addNotification({
            dataBddPrefix: 'addTask',
            lines: [{ text: `${title} ${formatting.formatDate(date)}` }],
            icon: 'success',
            notificationType: 'confirmation',
            title: notification.title,
          })
        );
        redirectToDetailsPage();
      })
      .catch(() => {});
  },
  onSearch: term => {
    if (term && term.length >= 3) {
      dispatch(search(term));
    } else if (term.length === 0 && !!housingOfficerSearchResults.length) {
      dispatch(clearSearch());
    }
  },
  onUnmount: () => {
    dispatch(clearTaskError());
    dispatch(clearSearch());
  },
  updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
  // TODO: remove this next line. By the looks of it is not needed anymore. However, I'm not 100% sure.
  // So I'm just leaving it here in case this later becomes a bug, in QA.
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
