import React from 'react';
import PropTypes from 'prop-types';
import { AdvancedFileUpload, Table, Typography, Button, Pagination } from 'nhh-styles';
import { MediaTableView } from '../../components';
import { MandatoryField, TableWrapper, AttachmentsWrapper, ErrorText } from './components';
import AttachmentsTableFileName from '../../components/ShrinkableFileName';

class Attachments extends React.Component {
  state = {
    pageSize: 6,
  };

  componentDidMount() {
    this.props.getFilesByCaseId();
  }
  componentWillUnmount() {
    this.props.clearMediaState();
  }

  addCaseFile = fileUri => this.props.handleFilesChange([...this.props.selectedCaseFiles, fileUri]);

  removeCaseFile = fileUri =>
    this.props.handleFilesChange(this.props.selectedCaseFiles.filter(x => x !== fileUri));

  buildCaseFilesTable = () => {
    const { mandatoryAttachments, downloadFile, downloadedFiles } = this.props;

    if (!mandatoryAttachments.length && !downloadedFiles.length) return null;

    const mandatoryFilesTableData = mandatoryAttachments.map(file => [
      <AttachmentsTableFileName name={file.friendlyName} />,
      <MandatoryField>{this.props.dictionary.mandatoryAttachment}</MandatoryField>,
    ]);

    const caseFilesTableData = downloadedFiles.map(file => {
      const isSelected = this.props.selectedCaseFiles.includes(file.uri);

      return [
        <AttachmentsTableFileName
          isLink
          onClick={() => downloadFile(file.uri, file.name)}
          name={file.name}
        />,
        isSelected ? (
          <Button isText onClick={() => this.removeCaseFile(file.uri)}>
            {this.props.dictionary.removeCaseFile}
          </Button>
        ) : (
          <Button className={'success'} isText onClick={() => this.addCaseFile(file.uri)}>
            {this.props.dictionary.attachCaseFile}
          </Button>
        ),
      ];
    });

    const { pageSize } = this.state;

    return (
      <AttachmentsWrapper>
        <Typography.Label>{this.props.dictionary.mandatoryAttachmentLabel}</Typography.Label>
        <Typography.P>{this.props.dictionary.mandatoryAttachmentParagraph}</Typography.P>
        <TableWrapper>
          <Pagination
            initialPageSize={pageSize}
            items={mandatoryFilesTableData.concat(caseFilesTableData)}
            pageSize={6}
            render={items => {
              if (items.length > pageSize) {
                this.setState({ pageSize: items.length });
              }

              return <Table addExtraTd={false} tdWrap data={items} />;
            }}
          />
        </TableWrapper>
      </AttachmentsWrapper>
    );
  };

  render() {
    if (!this.props.hasGeneratedCorrespondence) {
      return null;
    }

    const caseFilesTable = this.buildCaseFilesTable();

    const mediaTableViewProps = {
      // for clarity only; 'files' is passed automatically to renderer by AdvancedFileUpload
      files: this.props.pendingFiles,
      // for clarity only 'onRemove' is passed automatically to renderer by AdvancedFileUpload
      onRemove: this.props.onRemove,
      onRetry: this.props.onRetry,
      removeButtonLabel: this.props.dictionary.removeButtonLabel,
      retryButtonLabel: this.props.dictionary.retryButtonLabel,
      uploadSuccessMessage: this.props.dictionary.uploadSuccessMessage,
      genericErrorMessage: this.props.dictionary.genericErrorMessage,
    };

    return (
      <React.Fragment>
        {caseFilesTable}
        {this.props.hasDownloadError && (
          <ErrorText>{this.props.dictionary.genericErrorMessage}</ErrorText>
        )}
        <AttachmentsWrapper>
          <AdvancedFileUpload
            {...this.props.dictionary}
            accept={this.props.acceptedFileExtensions}
            files={this.props.pendingFiles}
            labelText={this.props.dictionary.labelText}
            maxFiles={this.props.maxFiles}
            maxFileSize={this.props.maxFileSize}
            onChange={this.props.onChange}
            onRemove={this.props.onRemove}
            previewsRenderer={MediaTableView}
            text={this.props.dictionary.text}
            {...mediaTableViewProps}
          />
        </AttachmentsWrapper>
      </React.Fragment>
    );
  }
}

Attachments.defaultProps = {
  dictionary: {},
  hasDownloadError: false,
};

export const attachmentPropTypes = {
  acceptedFileExtensions: PropTypes.string.isRequired,
  clearMediaState: PropTypes.func.isRequired,
  dictionary: PropTypes.shape({
    attachCaseFile: PropTypes.string.isRequired,
    genericErrorMessage: PropTypes.string.isRequired,
    labelText: PropTypes.string.isRequired,
    mandatoryAttachment: PropTypes.string.isRequired,
    mandatoryAttachmentLabel: PropTypes.string.isRequired,
    mandatoryAttachmentParagraph: PropTypes.string.isRequired,
    removeButtonLabel: PropTypes.string.isRequired,
    removeCaseFile: PropTypes.string.isRequired,
    retryButtonLabel: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    uploadSuccessMessage: PropTypes.string.isRequired,
  }).isRequired,
  downloadedFiles: PropTypes.array.isRequired,
  downloadFile: PropTypes.func.isRequired,
  getFilesByCaseId: PropTypes.func.isRequired,
  handleFilesChange: PropTypes.func.isRequired,
  hasGeneratedCorrespondence: PropTypes.bool.isRequired,
  mandatoryAttachments: PropTypes.array.isRequired,
  maxFiles: PropTypes.number.isRequired,
  maxFileSize: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  pendingFiles: PropTypes.arrayOf(
    PropTypes.shape({
      errorText: PropTypes.string,
      hasBeenUploaded: PropTypes.bool,
      hasUploadError: PropTypes.bool,
      id: PropTypes.string,
      isUploading: PropTypes.bool,
    })
  ).isRequired,
  selectedCaseFiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  hasDownloadError: PropTypes.bool,
};

Attachments.propTypes = attachmentPropTypes;

export default Attachments;
