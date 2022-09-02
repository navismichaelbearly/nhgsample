import PropTypes from 'prop-types';
import React from 'react';
import { Loader, Radio, RadioGroup, validate } from 'nhh-styles';
import any from 'ramda/src/any';
import compose from 'ramda/src/compose';
import equals from 'ramda/src/equals';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import values from 'ramda/src/values';
import format from 'string-format';
import {
  FieldRow,
  FormWrapper,
  PreviewLinkContainer,
  PreviewLink,
  PreviewTemplate,
} from '../../components';
import { ErrorMessage } from './components';
import { PageContent } from '../';
import connect from './connect';
import { BASE64IMAGE } from '../../constants/previewTemplateTypes';

const dataBddPrefix = 'sendCorrespondence';

const initialState = { errors: {}, recipient: '', sendingMethod: '', template: '' };

export class SendCorrespondenceCompositions extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.stateDependency = ['recipient', 'template', 'sendingMethod'];
  }
  componentDidMount() {
    const { updatePageHeader, resetData } = this.props;
    updatePageHeader();
    resetData();
  }

  getSendingMethods = () => {
    const selectedTemplate = this.props.templates.find(d => d.id === this.state.template.id);
    return selectedTemplate
      ? selectedTemplate.potentialSendingMethods.filter(d => d !== 'System')
      : [];
  };

  handleNext = eve => {
    eve.preventDefault();
    const validation = this.validate();
    if (validation.isValid) {
      const { recipient, template, sendingMethod } = this.state;

      this.props.onNext({
        recipient,
        template,
        sendingMethod,
      });
    } else {
      this.setState({
        errors: {
          recipient: path(['errors', 'recipient', 'message'], validation),
          template: path(['errors', 'template', 'message'], validation),
          sendingMethod: path(['errors', 'sendingMethod', 'message'], validation),
        },
      });
    }
  };

  previewSelectedTemplate = () => {
    const template = (
      <PreviewTemplate
        content={this.state.template.templatePreviewImageLink}
        dataBddPrefix={`${dataBddPrefix}-template`}
        errorMessage={this.props.errorText.noTemplateFound}
        label={this.props.labels.closeTemplate}
        onClose={this.props.closeTemplate}
        type={BASE64IMAGE}
      />
    );
    this.props.openTemplate(template);
  };

  resetErrors() {
    this.setState({ errors: { recipient: null, template: null } });
  }

  updateInputState = ({ target: { dataset, value } }) => {
    this.setState({ [dataset.stateKey]: value }, () => {
      this.resetErrors();
      this.props.setTemplatePreview(
        this.state.template ? this.state.template.templatePreviewImageLink : ''
      );
    });
  };

  resetChildren = (parent, stateDependencyArray) => {
    if (parent && stateDependencyArray.indexOf(parent) >= 0) {
      const children = stateDependencyArray.slice(stateDependencyArray.indexOf(parent) + 1);
      const stateChange = children.reduce((a, b) => {
        // eslint-disable-next-line no-param-reassign
        a[b] = '';
        return a;
      }, {});
      this.setState(stateChange);
    }
  };

  validate = () => {
    const { errorText } = this.props;
    const validations = {};
    ['recipient', 'template'].forEach(d => {
      validations[d] = validate(this.state[d], {
        errors: { default: errorText[d] },
      });
    });

    if (this.getSendingMethods().length) {
      validations.sendingMethod = validate(this.state.sendingMethod, {
        errors: { default: errorText.sendingMethod },
      });
    }

    const validationFailed = compose(equals(false), prop('didValidate'));

    const anyValidationsFailed = any(validationFailed)(values(validations));

    return {
      errors: validations,
      isValid: !anyValidationsFailed,
    };
  };

  renderTemplates() {
    const {
      labels: { template: templateLabel },
      templates,
      templatesLoading,
      templatesError,
      errorText,
    } = this.props;

    const { errors, template } = this.state;

    if (templatesLoading) {
      return <Loader />;
    }

    if (templatesError) {
      return <ErrorMessage>{errorText.noTemplateFound}</ErrorMessage>;
    }
    // eslint-disable-next-line no-nested-ternary
    return templates.length > 0 ? (
      <FieldRow>
        <RadioGroup error={errors.template} required labelText={templateLabel} name="template">
          {templates.map(t => (
            <Radio
              key={t.id}
              display="block"
              checked={template.id === t.id}
              data-bdd={`${dataBddPrefix}-template-${t.name}`}
              data-state-key="template"
              id={t.id}
              onChange={() => {
                this.updateInputState({
                  target: { dataset: { stateKey: 'template' }, value: t },
                });
                this.resetChildren('template', this.stateDependency);
              }}
            >
              {t.name}
            </Radio>
          ))}
        </RadioGroup>
      </FieldRow>
    ) : null;
  }

  render() {
    const {
      recipients,
      getTemplates,
      onBack,
      labels: {
        recipient: recipientLabel,
        sendingMethod: sendingMethodLabel,
        backButton,
        nextButton,
        previewTemplate,
      },
    } = this.props;
    const { errors, recipient, sendingMethod } = this.state;
    return (
      <PageContent>
        <div className="col-lg-9">
          <FormWrapper
            backButtonText={backButton}
            formName="SendCorrespondence"
            handleBackClick={onBack}
            handleFormSubmit={this.handleNext}
            submitButtonText={nextButton}
          >
            <FieldRow>
              <RadioGroup
                error={errors.recipient}
                required
                labelText={recipientLabel}
                name="recipient"
              >
                {recipients.map(({ name, value }) => (
                  <Radio
                    key={name}
                    display="block"
                    checked={recipient === name}
                    data-bdd={`${dataBddPrefix}-recipient-${name}`}
                    data-state-key="recipient"
                    id={name}
                    onChange={() => {
                      this.updateInputState({
                        target: { dataset: { stateKey: 'recipient' }, value: name },
                      });
                      getTemplates(value);
                      this.resetChildren('recipient', this.stateDependency);
                    }}
                  >
                    {name}
                  </Radio>
                ))}
              </RadioGroup>
            </FieldRow>
            {this.renderTemplates()}
            {this.state.template.id && (
              <PreviewLinkContainer>
                <PreviewLink
                  data-bdd={`${dataBddPrefix}-previewLink`}
                  onClick={this.previewSelectedTemplate}
                  isText
                >
                  {format(previewTemplate, { templateName: this.state.template.name })}
                </PreviewLink>
              </PreviewLinkContainer>
            )}
            {!!this.getSendingMethods().length && (
              <FieldRow>
                <RadioGroup
                  error={errors.sendingMethod}
                  required
                  labelText={sendingMethodLabel}
                  name="sendingMethod"
                >
                  {this.getSendingMethods().map(name => (
                    <Radio
                      key={name}
                      display="block"
                      checked={sendingMethod === name}
                      data-bdd={`${dataBddPrefix}-method-${name}`}
                      data-state-key="sendingMethod"
                      id={name}
                      onChange={() => {
                        this.updateInputState({
                          target: { dataset: { stateKey: 'sendingMethod' }, value: name },
                        });
                      }}
                    >
                      {name}
                    </Radio>
                  ))}
                </RadioGroup>
              </FieldRow>
            )}
          </FormWrapper>
        </div>
      </PageContent>
    );
  }
}

SendCorrespondenceCompositions.defaultProps = {
  templates: [],
};

SendCorrespondenceCompositions.propTypes = {
  closeTemplate: PropTypes.func.isRequired,
  errorText: PropTypes.shape({
    noTemplateFound: PropTypes.string.isRequired,
  }).isRequired,
  getTemplates: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    backButton: PropTypes.string.isRequired,
    closeTemplate: PropTypes.string.isRequired,
    nextButton: PropTypes.string.isRequired,
    previewTemplate: PropTypes.string.isRequired,
    recipient: PropTypes.string.isRequired,
    template: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  openTemplate: PropTypes.func.isRequired,
  recipients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  resetData: PropTypes.func.isRequired,
  setTemplatePreview: PropTypes.func.isRequired,
  templatesError: PropTypes.bool.isRequired,
  templatesLoading: PropTypes.bool.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      potentialSendingMethods: PropTypes.arrayOf(PropTypes.string),
      templatePreviewImageLink: PropTypes.string,
    })
  ),
};

export default connect(SendCorrespondenceCompositions);
