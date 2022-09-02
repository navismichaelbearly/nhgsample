import React, { Fragment, Component } from 'react';
import { NotificationPanel, Select, Button } from 'nhh-styles';
import PropTypes from 'prop-types';
import equals from 'ramda/src/equals';
import uniq from 'ramda/src/uniq';

import { PageContent } from '../';
import connect from './connect';
import { FieldRow, FormWrapper, NotificationWrapper } from '../../components';
import Attachments, { attachmentPropTypes } from './Attachments';
import GenerateCorrespondence from './GenerateCorrespondence';
import DraftCorrespondencePreviewDocuments from './DraftCorrespondencePreviewDocuments';
import { errorTextLabels, labelsPropTypes } from './types';
import { LETTER, EMAIL, SMS, POST } from '../../constants/correspondenceSendingMethods';
import { CUSTOMER } from '../../constants/correspondenceRecipients';
import LOCALPRINT from '../../constants/printingMethods';

const dataBddPrefix = 'CustomiseCorrespondence';
const draftCorrespondenceBddPrefix = 'DraftCorrespondence';

const initialState = {
  errors: {},
  printingOption: '',
  mergeFields: {},
  selectedCaseFiles: [],
  isGenerateCorrespondenceFormValid: false,
  documentsPreviewed: [],
};

export class CustomiseCorrespondenceCompositions extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  componentDidMount() {
    const {
      correspondenceId,
      redirectToSendCorrespondence,
      templateId,
      getSubstitutionFields,
      updatePageHeader,
    } = this.props;
    updatePageHeader();
    if (templateId && correspondenceId) {
      getSubstitutionFields(templateId);
    } else {
      redirectToSendCorrespondence();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    );
  }

  componentWillUnmount() {
    this.props.onUnmount();
  }

  handleFilesChange = files => {
    this.setState({ selectedCaseFiles: files });
  };

  handleSubmit = (e, sendingMethod) => {
    const { printerOptions, onSubmit } = this.props;
    e.preventDefault();
    const payload = {
      exstingDocumentUrlsToAttach: this.state.selectedCaseFiles,
    };

    if (sendingMethod === LETTER || sendingMethod === POST) {
      payload.printer = {
        printerId: printerOptions.find(item => item.friendlyName === this.state.printingOption).id,
      };
    }
    onSubmit(payload);
  };

  updateInputState = ({ target: { dataset, value } }) => {
    this.setState({ [dataset.stateKey]: value });
  };

  previewDocument = (id, template) => {
    const documentsPreviewed = uniq([...this.state.documentsPreviewed, id]);
    this.setState({ documentsPreviewed });
    if (template) this.props.openTemplate(template);
  };

  validate(sendingMethod) {
    const { correspondenceDocuments, hasMediaErrors, fatalError } = this.props;
    const { documentsPreviewed, printingOption, isGenerateCorrespondenceFormValid } = this.state;

    const generatedDocumentIds = correspondenceDocuments.map(doc => doc.id);

    const isFormValidatedBySendingMethod =
      !sendingMethod ||
      ((sendingMethod === LETTER || sendingMethod === POST) && printingOption !== '') ||
      sendingMethod === EMAIL ||
      sendingMethod === SMS;

    const isDocumentValidated = correspondenceDocuments.length || isGenerateCorrespondenceFormValid;

    const isValid =
      // Are correspondenceDocuments generated
      !!correspondenceDocuments.length &&
      isDocumentValidated &&
      !fatalError &&
      // Have all documents been reviewed
      equals(documentsPreviewed.sort(), generatedDocumentIds.sort()) &&
      // is a letter and a printingOption is selected
      isFormValidatedBySendingMethod &&
      // the uploader returned no errors
      !hasMediaErrors;

    return isValid;
  }

  validateHandler = isValid => this.setState({ isGenerateCorrespondenceFormValid: isValid });

  render() {
    const {
      correspondenceDocuments,
      discard,
      generatePreviewLoading,
      onBack,
      labels: {
        backButton,
        submitButton,
        discard: discardText,
        selectPrintingOption,
        cancel: cancelText,
      },
      sendingMethod,
      fatalError,
      isLoading,
      recipient,
      attachmentProps,
    } = this.props;

    const { printingOption, selectedCaseFiles } = this.state;

    let method = sendingMethod;
    if (recipient === CUSTOMER && correspondenceDocuments.length) {
      if (
        correspondenceDocuments.find(
          ({ sendingMethod: sm }) => sm.toUpperCase() === POST.toUpperCase()
        )
      ) {
        method = POST;
      }
    }

    // Can only attach documents when it is either Letter or Email.
    // https://nottinghill.visualstudio.com/Workwise/_workitems/edit/2565
    const canAddAttachments =
      (recipient === CUSTOMER &&
        correspondenceDocuments.length &&
        correspondenceDocuments.every(
          doc => doc.type && doc.type.toUpperCase() !== SMS.toUpperCase()
        )) ||
      [EMAIL, LETTER].includes(method);
    const isValid = this.validate(method);

    return (
      <PageContent>
        <div className="col-lg-9">
          <FormWrapper
            loading={isLoading}
            backButtonText={backButton}
            disablePropertyInformationEditMode
            formName="SendCorrespondence"
            handleBackClick={onBack}
            handleFormSubmit={e => this.handleSubmit(e, method)}
            submitButtonText={submitButton}
            disableSubmit={!isValid}
            otherActionsLeft={
              <Button
                data-bdd={'SendCorrespondence-discard'}
                buttonType="secondary"
                isFullWidth
                type="button"
                onClick={discard}
              >
                {attachmentProps.hasGeneratedCorrespondence ? discardText : cancelText}
              </Button>
            }
          >
            <GenerateCorrespondence
              arrearsId={this.props.arrearsId}
              closeTemplate={this.props.closeTemplate}
              dataBddPrefix={dataBddPrefix}
              errorText={this.props.errorText}
              generatePreviewLoading={generatePreviewLoading}
              generatePreviewSubmitText={this.props.generatePreviewSubmitText}
              generateDraft={this.props.generateDraft}
              labels={this.props.labels}
              openTemplate={this.props.openTemplate}
              recipient={recipient}
              retriableError={this.props.retriableError}
              sendingMethod={method}
              substitutionFields={this.props.substitutionFields}
              templateId={this.props.templateId}
              templatePreviewImage={this.props.templatePreviewImage}
              validateHandler={this.validateHandler}
              chosenTemplateName={this.props.chosenTemplateName}
            />
            {(method === LETTER || method === POST) && !!correspondenceDocuments.length && (
              <Fragment>
                {!this.props.printerOptions.length ? (
                  <NotificationWrapper data-bdd={`${dataBddPrefix}-printingOptionsNotProvided`}>
                    <NotificationPanel
                      icon="warning"
                      description={this.props.genericContactITErrorText}
                      hideCloseButton
                      show
                    />
                  </NotificationWrapper>
                ) : (
                  <FieldRow>
                    <Select
                      dataBdd={`${dataBddPrefix}-printingOption`}
                      data-state-key="printingOption"
                      error={this.state.errors.printingOptionMissing}
                      isFullWidth
                      items={this.props.printerOptions}
                      itemToString={item => (item ? item.friendlyName : '')}
                      labelText={selectPrintingOption}
                      onChange={({ friendlyName }) =>
                        this.updateInputState({
                          target: {
                            dataset: { stateKey: 'printingOption' },
                            value: friendlyName,
                          },
                        })
                      }
                      required
                      inputValue={printingOption}
                    />
                  </FieldRow>
                )}
              </Fragment>
            )}
            <DraftCorrespondencePreviewDocuments
              closeTemplate={this.props.closeTemplate}
              dataBddPrefix={draftCorrespondenceBddPrefix}
              documents={correspondenceDocuments}
              errorText={this.props.errorText}
              fatalError={fatalError}
              generatePreviewLoading={generatePreviewLoading}
              retriableError={this.props.retriableError}
              labels={this.props.labels}
              onPreview={this.previewDocument}
              isLocalPrint={printingOption === LOCALPRINT}
            />
            {canAddAttachments && (
              <Attachments
                {...this.props.attachmentProps}
                handleFilesChange={this.handleFilesChange}
                selectedCaseFiles={selectedCaseFiles}
              />
            )}
          </FormWrapper>
        </div>
      </PageContent>
    );
  }
}

CustomiseCorrespondenceCompositions.defaultProps = {
  correspondenceDocuments: [],
  printerOptions: [],
  fatalError: false,
  retriableError: false,
  templateId: '',
  templatePreviewImage: '',
};

CustomiseCorrespondenceCompositions.propTypes = {
  arrearsId: PropTypes.string.isRequired,
  attachmentProps: PropTypes.shape(attachmentPropTypes).isRequired,
  chosenTemplateName: PropTypes.string.isRequired,
  closeTemplate: PropTypes.func.isRequired,
  correspondenceId: PropTypes.string.isRequired,
  discard: PropTypes.func.isRequired,
  errorText: errorTextLabels.isRequired,
  generateDraft: PropTypes.func.isRequired,
  generatePreviewLoading: PropTypes.bool.isRequired,
  generatePreviewSubmitText: PropTypes.string.isRequired,
  genericContactITErrorText: PropTypes.string.isRequired,
  getSubstitutionFields: PropTypes.func.isRequired,
  hasMediaErrors: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  labels: labelsPropTypes.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
  openTemplate: PropTypes.func.isRequired,
  recipient: PropTypes.string.isRequired,
  redirectToSendCorrespondence: PropTypes.func.isRequired,
  sendingMethod: PropTypes.string.isRequired,
  substitutionFields: PropTypes.array.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  correspondenceDocuments: PropTypes.array,
  fatalError: PropTypes.bool,
  printerOptions: PropTypes.array,
  retriableError: PropTypes.bool,
  templateId: PropTypes.string,
  templatePreviewImage: PropTypes.string,
};

export default connect(CustomiseCorrespondenceCompositions);
