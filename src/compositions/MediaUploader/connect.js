import qs from 'qs';
import { connect } from 'react-redux';
import pipe from 'ramda/src/pipe';
import identity from 'ramda/src/identity';
import format from 'string-format';
import getHelpers from '../../util/stateHelpers';
import fileUploadProperties from '../../constants/fileUploadProperties';
import {
  addPendingUploadFiles,
  removePendingUploadFile,
  uploadMediaFile,
  clearMediaState,
} from '../../ducks/media';
import { updateRibbon } from '../../ducks/ribbon';

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs, getString } = getHelpers(state);
  const { heading: mediaUploaderHeading, typeHeadings, ...dictionary } = getString(['media']);
  const { heading: arrearsDetailsHeading } = getString(['arrearsDetails']);

  // TYPE and ID correspond to the subject we are interacting with
  // i.e. correspondence, interaction, notes
  const { redirectTo = '/' } = qs.parse(ownProps.location.search, { ignoreQueryPrefix: true });

  const redirect = () => ownProps.history.push(redirectTo);

  const { arrearsId, type } = ownProps.match.params;

  return {
    acceptedFileExtensions: fileUploadProperties.acceptedFileExtensions,
    maxFiles:
      type === 'note' ? fileUploadProperties.maxFilesNotes : fileUploadProperties.maxFilesDefault,
    maxFileSizeBytes: fileUploadProperties.maxFileSizeBytes,
    media: get(['media']),
    redirect,
    canAddMultipleFiles: type !== 'note',
    mediaUploaderHeading,
    breadcrumb: getBreadcrumbs(`${typeHeadings[type]} [ ${mediaUploaderHeading} ]`, {}, [
      {
        label: arrearsDetailsHeading,
        to: `/arrears-details/${arrearsId}`,
      },
    ]),
    dictionary: {
      errorText: getString(['media', 'errorText']),
      labelText: getString(['media', 'labelText']),
      paragraphAttach: format(dictionary.paragraphAttach, {
        type: dictionary.paragraphTypes[type],
      }),
      paragraphContinue: getString(['media', 'paragraphContinue']),
      removeButtonLabel: getString(['media', 'removeButtonLabel']),
      retryButtonLabel: getString(['media', 'retryButtonLabel']),
      uploadSuccessMessage: getString(['media', 'uploadSuccessMessage']),
      submitLabel: getString(['media', 'submitLabel']),
      text: getString(['media', 'text']),
    },
  };
};

export const mergeProps = (
  { media, breadcrumb, mediaUploaderHeading, canAddMultipleFiles, redirect, ...stateProps },
  { dispatch },
  {
    match: {
      params: { type, typeId: id },
    },
    ...ownProps
  }
) => ({
  ...media,
  ...stateProps,
  multiple: canAddMultipleFiles,
  onChange: files => {
    if (!canAddMultipleFiles) {
      // if the user cannot add multiple files,
      // let's clear the existing state first
      dispatch(clearMediaState());
    }
    dispatch(addPendingUploadFiles(files));
  },
  clearMediaState: pipe(clearMediaState, dispatch),
  onRemove: pipe(removePendingUploadFile, dispatch),
  onRetry: pipe(uploadMediaFile(type, id), dispatch),
  updatePageHeader: () => dispatch(updateRibbon({ title: mediaUploaderHeading, breadcrumb })),
  onSubmit: async () => {
    if (media.pendingFiles.length > 0) {
      const results = await Promise.all(
        media.pendingFiles
          .filter(file => !file.hasBeenUploaded)
          .map(pipe(uploadMediaFile(type, id), dispatch))
      );

      if (results.every(identity)) {
        // if everything has been uploaded successfully
        redirect();
      }
    } else {
      // If there are no files to upload, just skip this page
      redirect();
    }
  },

  ...ownProps,
});

export default connect(mapStateToProps, null, mergeProps);
