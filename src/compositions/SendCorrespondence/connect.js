import { connect } from 'react-redux';
import path from 'ramda/src/path';
import uuidv4 from 'uuid/v4';

import correspondenceRecipients from '../../constants/correspondenceRecipients';
import { setModalContent } from '../../ducks/modal';
import { updateRibbon } from '../../ducks/ribbon';
import {
  getTemplates,
  resetData,
  setFormData,
  setTemplatePreview,
} from '../../ducks/sendCorrespondence';
import getHelpers from '../../util/stateHelpers';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs, getString } = getHelpers(state);
  const arrears = get(['arrears', 'items']);
  const templates = get(['sendCorrespondence', 'templates']);
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const arrear = arrears.find(x => x.id === arrearsId) || {};
  const arrearsDetailsHeading = getString(['arrearsDetails', 'heading']);
  const genericContactITErrorText = getString(['genericContactITErrorText']);
  const correspondenceText = getString(['correspondence']);
  const { sendCorrespondence, errorText, labels } = correspondenceText;
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);
  const redirectToCustomiseCorrespondence = correspondenceId =>
    ownProps.history.push(`/arrears-details/${arrearsId}/send-correspondence/${correspondenceId}`);
  return {
    arrear,
    breadcrumb: getBreadcrumbs(
      sendCorrespondence,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    errorText,
    genericContactITErrorText,
    heading: sendCorrespondence,
    redirectToDetailsPage,
    redirectToCustomiseCorrespondence,
    recipients: correspondenceRecipients,
    templates,
    templatesLoading: get(['sendCorrespondence', 'loadingTemplates']),
    templatesError: get(['sendCorrespondence', 'templatesError']),
    labels,
  };
};

export const mergeProps = (
  {
    arrear,
    breadcrumb,
    heading,
    redirectToDetailsPage,
    redirectToCustomiseCorrespondence,
    ...stateProps
  },
  { dispatch },
  ownProps
) => ({
  ...stateProps,
  getTemplates: recipient =>
    dispatch(getTemplates(recipient, { businessUnit: arrear.businessUnit })).catch(() => {}),
  onBack: () => redirectToDetailsPage(),
  onNext: params => {
    dispatch(setFormData(params));
    const correspondenceId = uuidv4();
    redirectToCustomiseCorrespondence(correspondenceId);
  },
  closeTemplate: () => dispatch(setModalContent()),
  openTemplate: template => dispatch(setModalContent(template)),
  setTemplatePreview: link => dispatch(setTemplatePreview(link)),
  resetData: () => dispatch(resetData()),
  updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
