import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AdvancedFileUpload } from 'nhh-styles';
import { MediaTableView, FormWrapper } from '../../components';
import { PageContent } from '../';

import { Wrapper } from './components';

import connect from './connect';

export class MediaUploader extends Component {
  componentDidMount() {
    this.props.updatePageHeader();
  }

  componentWillUnmount() {
    this.props.clearMediaState();
  }

  render() {
    const { hasFileUploadErrors, dictionary } = this.props;

    const mediaTableViewProps = {
      // for clarity only; 'files' is passed automatically to renderer by AdvancedFileUpload
      files: this.props.pendingFiles,
      // for clarity only 'onRemove' is passed automatically to renderer by AdvancedFileUpload
      onRemove: this.props.onRemove,
      onRetry: this.props.onRetry,
      removeButtonLabel: dictionary.removeButtonLabel,
      retryButtonLabel: dictionary.retryButtonLabel,
      uploadSuccessMessage: dictionary.uploadSuccessMessage,
    };

    return (
      <PageContent>
        <div className="col-lg-12">
          <FormWrapper
            hidePropertyInformation
            formName="mediaUploader"
            formError={hasFileUploadErrors ? dictionary.errorText : null}
            handleFormSubmit={this.props.onSubmit}
            submitButtonText={dictionary.submitLabel}
            disableSubmit={hasFileUploadErrors}
          >
            <p>
              {dictionary.paragraphAttach}
              <br />
              {dictionary.paragraphContinue}
            </p>
            <Wrapper>
              <AdvancedFileUpload
                accept={this.props.acceptedFileExtensions}
                files={this.props.pendingFiles}
                labelText={dictionary.labelText}
                maxFiles={this.props.maxFiles}
                maxFileSize={this.props.maxFileSizeBytes}
                multiple={this.props.multiple}
                onChange={this.props.onChange}
                onRemove={this.props.onRemove}
                previewsRenderer={MediaTableView}
                text={dictionary.text}
                {...mediaTableViewProps}
              />
            </Wrapper>
          </FormWrapper>
        </div>
      </PageContent>
    );
  }
}

MediaUploader.defaultProps = {
  hasFileUploadErrors: false,
};

MediaUploader.propTypes = {
  acceptedFileExtensions: PropTypes.string.isRequired,
  clearMediaState: PropTypes.func.isRequired,
  dictionary: PropTypes.shape({
    paragraphAttach: PropTypes.string.isRequired,
    paragraphContinue: PropTypes.string.isRequired,
    removeButtonLabel: PropTypes.string.isRequired,
    retryButtonLabel: PropTypes.string.isRequired,
    uploadSuccessMessage: PropTypes.string.isRequired,
    errorText: PropTypes.string,
    labelText: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  maxFiles: PropTypes.number.isRequired,
  maxFileSizeBytes: PropTypes.number.isRequired,
  multiple: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pendingFiles: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ).isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  hasFileUploadErrors: PropTypes.bool,
};

export default connect(MediaUploader);
