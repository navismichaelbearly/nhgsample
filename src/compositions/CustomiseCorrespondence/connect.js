import path from 'ramda/src/path';
import pipe from 'ramda/src/pipe';
import identity from 'ramda/src/identity';
import { connect } from 'react-redux';

import { setModalContent } from '../../ducks/modal';
import { updateRibbon } from '../../ducks/ribbon';
import {
  cancelCorrespondence,
  generatePreviewCorrespondence,
  getCorrespondenceDocument,
  getTemplatesSubstitutions,
  resetData,
  submitAPI,
} from '../../ducks/sendCorrespondence';
import {
  addPendingUploadFiles,
  clearMediaState,
  getFilesByCaseId,
  removePendingUploadFile,
  uploadMediaFile,
} from '../../ducks/media';
import getHelpers from '../../util/stateHelpers';
import { FailedFatal, FailedRetriable } from '../../constants/correspondenceErrorTypes';
import { addNotification } from '../../ducks/notifications';
import scrolltoTop from '../../util/scrolltoTop';
import downloadFile from '../../util/downloadFile';
import fileUploadProperties from '../../constants/fileUploadProperties';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs, getString } = getHelpers(state);
  const arrearsDetailsHeading = getString(['arrearsDetails', 'heading']);
  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const correspondenceId = path(['match', 'params', 'correspondenceId'], ownProps);
  const correspondenceDocuments = get(['sendCorrespondence', 'correspondenceDocuments']);
  const mandatoryAttachments = get(['sendCorrespondence', 'mandatoryAttachments']);
  const chosenTemplateName = get(['sendCorrespondence', 'chosenTemplateName']);
  const correspondenceText = getString(['correspondence']);
  const {
    customiseCorrespondence,
    errorText,
    labels,
    attachments,
    notification,
  } = correspondenceText;
  const generatePreviewError = get(['sendCorrespondence', 'generatePreviewError']);
  const generatePreviewLoading = get(['sendCorrespondence', 'generatePreviewLoading']);
  const redirectToSendCorrespondence = () =>
    ownProps.history.push(`/arrears-details/${arrearsId}/send-correspondence/create`);
  const printerOptions = get(['sendCorrespondence', 'printerOptions']);
  const recipient = get(['sendCorrespondence', 'recipient']);
  const sendingMethod = get(['sendCorrespondence', 'sendingMethod']);
  const substitutionFields = get(['sendCorrespondence', 'substitutionFields']);
  const templateId = get(['sendCorrespondence', 'template', 'id']);
  const templatePreviewImage = get(['sendCorrespondence', 'templatePreviewImage']);
  const fatalError =
    !!generatePreviewError || !!correspondenceDocuments.find(d => d.errorType === FailedFatal);
  const retriableError = !!correspondenceDocuments.find(d => d.errorType === FailedRetriable);
  const media = get(['media']);
  const hasMediaErrors = get(['media', 'hasFileUploadErrors']);
  const isLoading = get(['sendCorrespondence', 'loading']);
  const didFail = get(['sendCorrespondence', 'error']);
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);

  return {
    arrearsId,
    attachmentProps: {
      acceptedFileExtensions: fileUploadProperties.acceptedFileExtensions,
      downloadFile,
      hasFileUploadErrors: media.hasFileUploadErrors,
      hasGeneratedCorrespondence: correspondenceDocuments.length > 0,
      mandatoryAttachments,
      maxFiles: fileUploadProperties.maxFilesDefault,
      maxFileSize: fileUploadProperties.maxFileSizeBytes,
      downloadedFiles: media.downloadedFiles,
      hasDownloadError: !!media.downloadError,
      pendingFiles: media.pendingFiles,
      dictionary: {
        ...attachments,
      },
    },
    breadcrumb: getBreadcrumbs(
      customiseCorrespondence,
      {},
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      }
    ),
    correspondenceId,
    correspondenceDocuments,
    chosenTemplateName,
    errorText,
    fatalError,
    generatePreviewSubmitText: retriableError ? labels.retryGenerateDraft : labels.generateDraft,
    generatePreviewLoading,
    genericContactITErrorText: getString(['genericContactITErrorText']),
    heading: customiseCorrespondence,
    printerOptions,
    recipient,
    redirectToSendCorrespondence,
    labels,
    retriableError,
    sendingMethod,
    substitutionFields,
    templateId,
    templatePreviewImage,
    hasMediaErrors,
    isLoading,
    didFail,
    redirectToDetailsPage,
    notification,
  };
};

export const mergeProps = (
  {
    arrearsId,
    breadcrumb,
    correspondenceId,
    heading,
    redirectToSendCorrespondence,
    attachmentProps,
    redirectToDetailsPage,
    notification,
    didFail,
    ...stateProps
  },
  { dispatch },
  ownProps
) => {
  const progress = action => {
    redirectToDetailsPage();
    dispatch(
      addNotification({
        dataBddPrefix: 'correspondence-sent',
        icon: 'success',
        notificationType: 'confirmation',
        title: notification[action],
      })
    );
  };
  const stayOnThePageAndDisplayError = () => {
    dispatch(
      addNotification({
        dataBddPrefix: 'correspondence-sent',
        icon: 'warning',
        notificationType: 'confirmation',
        title: notification.failure,
      })
    );
    scrolltoTop();
  };

  const discardAction = async () => {
    await dispatch(cancelCorrespondence(correspondenceId));
    progress('discard');
  };

  const cancelAction = () => progress('cancel');

  return {
    progress,
    ...stateProps,
    arrearsId,
    attachmentProps: {
      ...attachmentProps,
      onChange: pipe(addPendingUploadFiles, dispatch),
      clearMediaState: pipe(clearMediaState, dispatch),
      onRemove: pipe(removePendingUploadFile, dispatch),
      onRetry: file => dispatch(uploadMediaFile('correspondence', correspondenceId, file)),
      getFilesByCaseId: () => dispatch(getFilesByCaseId(arrearsId)),
    },
    correspondenceId,
    closeTemplate: () => dispatch(setModalContent()),
    generateDraft: params => {
      dispatch(generatePreviewCorrespondence(correspondenceId, params, getCorrespondenceDocument));
    },
    openTemplate: ({ template, limitMaxWidth }) => {
      const extendStyle = limitMaxWidth ? `max-width: 80%` : null;
      dispatch(setModalContent(template, extendStyle));
    },
    getSubstitutionFields: templateId => {
      dispatch(getTemplatesSubstitutions(templateId));
    },
    onBack: () => redirectToSendCorrespondence(),
    onSubmit: async payload => {
      const { pendingFiles } = attachmentProps;
      if (pendingFiles.length > 0) {
        const results = await Promise.all(
          pendingFiles
            .filter(file => !file.hasBeenUploaded)
            .map(file => dispatch(uploadMediaFile('correspondence', correspondenceId, file)))
        );

        if (results.every(identity)) {
          dispatch(submitAPI(correspondenceId, payload))
            .then(() => progress('success'))
            .catch(() => stayOnThePageAndDisplayError());
        }
      } else {
        dispatch(submitAPI(correspondenceId, payload))
          .then(() => progress('success'))
          .catch(() => stayOnThePageAndDisplayError());
      }
    },
    // this will either discard or cancel correspondence,
    // depending on whether it has been generated or not.
    discard: attachmentProps.hasGeneratedCorrespondence ? discardAction : cancelAction,
    onUnmount: () => {
      dispatch(resetData());
    },
    redirectToSendCorrespondence,
    updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
    ...ownProps,
  };
};

export default connect(mapStateToProps, null, mergeProps);
