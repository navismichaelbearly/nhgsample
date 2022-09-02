import { Loader, Typography } from 'nhh-styles';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { PreviewLinkContainer, PreviewLink, PreviewTemplate } from '../../components';
import { errorTextLabels, labelsPropTypes } from './types';
import forcePdfDownload from '../../util/forcePdfDownload';
import {
  PDF as ENCODING_TYPE_PDF,
  TEXT as ENCODING_TYPE_TEXT,
} from '../../constants/documentEncodingTypes';
import { HTML, TEXT } from '../../constants/previewTemplateTypes';
import { FailedFatal, FailedRetriable } from '../../constants/correspondenceErrorTypes';
import { Heading3, P, InLineLightP } from '../../components/Common/styled';

const { Error, H5 } = Typography;

class DraftCorrespondencePreviewDocuments extends React.PureComponent {
  constructor(props) {
    super(props);
    const documentIds = this.props.documents.reduce((acc, document) => {
      acc[document.id] = false;
      return acc;
    }, {});

    this.state = {
      ...documentIds,
    };
  }

  getPreviews(document) {
    const {
      labels: { viewPreview, alreadyPreviewed, manualPrint },
      dataBddPrefix,
      isLocalPrint,
    } = this.props;

    const { id, type, sendingMethod, errorType, recipientName } = document;
    const isPostalLetter =
      isLocalPrint && type.toLowerCase() === 'letter' && sendingMethod.toLowerCase() === 'post';

    return (
      <Fragment>
        <H5>
          {recipientName} ({sendingMethod})
        </H5>
        <PreviewLinkContainer>
          {errorType ? (
            <Error>{this.documentError(errorType)}</Error>
          ) : (
            <Fragment>
              {isPostalLetter && (
                <P className="m-0" data-bdd="manual-print">
                  {manualPrint}
                </P>
              )}
              <PreviewLink
                data-state-key={'previewLink'}
                data-bdd={`${dataBddPrefix}-previewLink`}
                onClick={() => this.handleDocumentPreview(document)}
                isText
              >
                {viewPreview}
              </PreviewLink>
              {this.state[id] === true && (
                <InLineLightP data-bdd="document-viewed">{alreadyPreviewed}</InLineLightP>
              )}
            </Fragment>
          )}
        </PreviewLinkContainer>
      </Fragment>
    );
  }

  /**
   * takes an id of a document and update state to show that the
   * user has clicked the preview link
   */
  markDocumentViewed(id) {
    this.setState({
      [id]: true,
    });
  }

  documentError = errorType => {
    let message = null;
    if (errorType === FailedFatal) {
      message = this.props.errorText.fatalError;
    } else if (errorType === FailedRetriable) {
      message = this.props.errorText.retriableError;
    }
    return message;
  };

  generationError = () => {
    let message = null;
    if (this.props.fatalError) {
      message = this.props.errorText.fatalError;
    } else if (this.props.retriableError) {
      message = this.props.errorText.retriableError;
    }
    return message;
  };

  handleDocumentPreview = ({ content, encodingType, id }) => {
    switch (encodingType) {
      case ENCODING_TYPE_PDF:
        forcePdfDownload(content);
        this.props.onPreview(id);
        break;
      case ENCODING_TYPE_TEXT:
      case HTML:
        {
          const template = (
            <PreviewTemplate
              content={content}
              dataBddPrefix={`draftCorrespondence-template`}
              onClose={this.props.closeTemplate}
              errorMessage={this.props.errorText.noTemplateFound}
              label={this.props.labels.closeTemplate}
              type={encodingType === HTML ? HTML : TEXT}
            />
          );
          this.props.onPreview(id, { template, limitMaxWidth: true });
        }
        break;
      default:
    }

    this.markDocumentViewed(id);
  };

  render() {
    const {
      labels: { generatedCorrespondence, viewPreviewsBeforeProceeding },
      documents,
    } = this.props;

    if (this.props.generatePreviewLoading) {
      return <Loader />;
    }

    return (
      <Fragment>
        {/* eslint-disable no-nested-ternary */}
        {documents.length ? (
          <Fragment>
            <Heading3>{generatedCorrespondence}</Heading3>
            <P>{viewPreviewsBeforeProceeding}</P>
            {documents.map(document => (
              <Fragment key={document.id}>
                {document.loading ? <Loader /> : this.getPreviews(document)}
              </Fragment>
            ))}
          </Fragment>
        ) : this.generationError() ? (
          <Error>{this.generationError()}</Error>
        ) : null}
      </Fragment>
    );
  }
}

DraftCorrespondencePreviewDocuments.defaultProps = {
  documents: [],
  fatalError: false,
  generatePreviewLoading: false,
  retriableError: false,
  isLocalPrint: false,
};

DraftCorrespondencePreviewDocuments.propTypes = {
  closeTemplate: PropTypes.func.isRequired,
  dataBddPrefix: PropTypes.string.isRequired,
  errorText: errorTextLabels.isRequired,
  labels: labelsPropTypes.isRequired,
  onPreview: PropTypes.func.isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      content: PropTypes.string,
      encodingType: PropTypes.string,
      errorMessages: PropTypes.object,
      errorType: PropTypes.string,
      id: PropTypes.string,
      recipientName: PropTypes.string,
      sendingMethod: PropTypes.string,
      status: PropTypes.string,
      type: PropTypes.string,
    }).isRequired
  ),
  fatalError: PropTypes.bool,
  generatePreviewLoading: PropTypes.bool,
  isLocalPrint: PropTypes.bool,
  retriableError: PropTypes.bool,
};

export default DraftCorrespondencePreviewDocuments;
