import { Field, Input, validate } from 'nhh-styles';
import PropTypes from 'prop-types';
import any from 'ramda/src/any';
import compose from 'ramda/src/compose';
import equals from 'ramda/src/equals';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import values from 'ramda/src/values';
import format from 'string-format';
import React, { Fragment } from 'react';
import { EMAIL, LETTER, SMS, SYSTEM } from '../../constants/correspondenceSendingMethods';
import { FieldRow, PreviewLinkContainer, PreviewLink, PreviewTemplate } from '../../components';
import { AddressTitle, GenerateDraftButton, GenerateDraftContainer } from './components';
import { errorTextLabels, labelsPropTypes } from './types';
import { THIRDPARTY } from '../../util/correspondenceRecipients';
import { BASE64IMAGE } from '../../constants/previewTemplateTypes';

const initialState = {
  errors: {},
  formSubmitted: false,
  mergeFields: {},
  staticFields: {
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    city: '',
    email: '',
    mobilePhone: '',
    postCode: '',
  },
};

export const getRegexFromRegexLiteral = regexLiteralString => {
  const lastSlash = regexLiteralString.lastIndexOf('/');
  // the string can be returned as an explicit regex
  if (lastSlash > 0) {
    const regexModifier = regexLiteralString.slice(lastSlash + 1);
    const regexPattern = regexLiteralString.slice(1, lastSlash);
    return new RegExp(regexPattern, regexModifier);
  }
  // or as a regex pattern, RegExp() accepts only a pattern
  return new RegExp(regexLiteralString);
};

class GenerateCorrespondence extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  onGenerateDraft = eve => {
    eve.preventDefault();
    const validation = this.validate();
    const stateErrors = {};
    // static fields
    switch (this.props.sendingMethod) {
      case LETTER:
        stateErrors.addressLine1 = path(['errors', 'addressLine1', 'message'], validation);
        stateErrors.addressLine2 = path(['errors', 'addressLine2', 'message'], validation);
        stateErrors.addressLine3 = path(['errors', 'addressLine3', 'message'], validation);
        stateErrors.city = path(['errors', 'city', 'message'], validation);
        stateErrors.postCode = path(['errors', 'postCode', 'message'], validation);
        break;
      case EMAIL:
        stateErrors.email = path(['errors', 'email', 'message'], validation);
        break;
      case SMS:
        stateErrors.mobilePhone = path(['errors', 'mobilePhone', 'message'], validation);
        break;
      default:
    }
    // merge fields
    Object.keys(validation.errors).forEach(mergeField => {
      stateErrors[mergeField] = path(['errors', mergeField, 'message'], validation);
    });

    this.setState({
      errors: stateErrors,
    });

    if (validation.isValid) {
      const generateDraftParams = {
        regarding: {
          id: this.props.arrearsId,
          type: 'Case',
        },
        templateId: this.props.templateId,
        templateSubstitionFieldAnswers: this.props.substitutionFields
          .filter(({ key }) => this.state.mergeFields[key])
          .map(({ key }) => ({
            key,
            value: this.state.mergeFields[key],
          })),
      };
      generateDraftParams.sendingPreference = this.props.sendingMethod || SYSTEM;
      if (this.props.recipient === THIRDPARTY) {
        switch (this.props.sendingMethod) {
          case LETTER:
            generateDraftParams.thirdParty = {
              address: {
                line1: this.state.staticFields.addressLine1,
                line2: this.state.staticFields.addressLine2,
                line3: this.state.staticFields.addressLine3,
                city: this.state.staticFields.city,
                postCode: this.state.staticFields.postCode,
              },
            };
            break;
          case EMAIL:
            generateDraftParams.thirdParty = {
              emailAddress: this.state.staticFields.email,
            };
            break;
          case SMS:
            generateDraftParams.thirdParty = {
              mobilePhone: this.state.staticFields.mobilePhone,
            };
            break;
          default:
        }
      }
      this.props.generateDraft(generateDraftParams);
      this.setState({
        formSubmitted: true,
      });
    }
  };

  disableForm = () =>
    this.props.generatePreviewLoading || (this.state.formSubmitted && !this.props.retriableError);

  staticFields = () => {
    const {
      dataBddPrefix,
      labels: {
        address,
        addressCity,
        addressLine1,
        addressLine2,
        addressLine3,
        addressPostcode,
        emailAddress,
        mobilePhone,
      },
      sendingMethod,
    } = this.props;

    const { errors, staticFields } = this.state;
    if (!sendingMethod) {
      return null;
    }
    switch (sendingMethod) {
      case LETTER: {
        return (
          <React.Fragment>
            <AddressTitle>{address}</AddressTitle>
            <FieldRow>
              <Field>
                <Input
                  data-bdd={`${dataBddPrefix}-addressLine1`}
                  data-state-key="addressLine1"
                  disabled={this.disableForm()}
                  error={errors.addressLine1}
                  id="addressLine1"
                  isFullWidth
                  labelText={addressLine1}
                  required
                  onChange={e => this.handleStaticInputChange('addressLine1', e.target.value)}
                  value={staticFields.addressLine1}
                />
              </Field>
              <Field>
                <Input
                  data-bdd={`${dataBddPrefix}-addressLine2`}
                  data-state-key={'addressLine2'}
                  disabled={this.disableForm()}
                  error={errors.addressLine2}
                  id="addressLine2"
                  isFullWidth
                  labelText={addressLine2}
                  onChange={e => this.handleStaticInputChange('addressLine2', e.target.value)}
                  value={staticFields.addressLine2}
                />
              </Field>
              <Field>
                <Input
                  data-bdd={`${dataBddPrefix}-addressLine3`}
                  data-state-key={'addressLine3'}
                  disabled={this.disableForm()}
                  error={errors.addressLine3}
                  id="addressLine3"
                  isFullWidth
                  labelText={addressLine3}
                  onChange={e => this.handleStaticInputChange('addressLine3', e.target.value)}
                  value={staticFields.addressLine3}
                />
              </Field>
              <Field>
                <Input
                  data-bdd={`${dataBddPrefix}-city`}
                  data-state-key={'city'}
                  disabled={this.disableForm()}
                  error={errors.city}
                  id="city"
                  isFullWidth
                  labelText={addressCity}
                  required
                  onChange={e => this.handleStaticInputChange('city', e.target.value)}
                  value={staticFields.city}
                />
              </Field>
              <Field>
                <Input
                  data-bdd={`${dataBddPrefix}-postCode`}
                  data-state-key={'postCode'}
                  disabled={this.disableForm()}
                  error={errors.postCode}
                  id="postCode"
                  isFullWidth
                  labelText={addressPostcode}
                  required
                  onChange={e => this.handleStaticInputChange('postCode', e.target.value)}
                  value={staticFields.postCode}
                />
              </Field>
            </FieldRow>
          </React.Fragment>
        );
      }
      case EMAIL: {
        return (
          <Field>
            <Input
              data-bdd={`${dataBddPrefix}-email`}
              data-state-key={'email'}
              disabled={this.disableForm()}
              error={errors.email}
              id="email"
              isFullWidth
              labelText={emailAddress}
              required
              onChange={e => this.handleStaticInputChange('email', e.target.value)}
              value={staticFields.email}
            />
          </Field>
        );
      }
      case SMS: {
        return (
          <Field>
            <Input
              data-bdd={`${dataBddPrefix}-mobilePhone`}
              data-state-key={'mobilePhone'}
              disabled={this.disableForm()}
              error={errors.mobilePhone}
              id="mobilePhone"
              isFullWidth
              labelText={mobilePhone}
              required
              onChange={e => this.handleStaticInputChange('mobilePhone', e.target.value)}
              value={staticFields.mobilePhone}
            />
          </Field>
        );
      }
      default:
        return null;
    }
  };

  resetMergeFieldsErrors(value) {
    const field = `mergeFields.${value}`;
    this.setState({ errors: { ...this.state.errors, [field]: null } });
  }

  updateMergeField = mergeKey => ({ target: { value } }) => {
    this.setState(
      prevState => ({
        mergeFields: {
          ...prevState.mergeFields,
          [mergeKey]: value,
        },
      }),
      this.resetMergeFieldsErrors(mergeKey)
    );
  };

  validate = () => {
    const { errorText } = this.props;
    const { staticFields } = this.state;
    const validations = {};
    switch (this.props.sendingMethod) {
      case LETTER:
        validations.addressLine1 = validate(staticFields.addressLine1, {
          errors: { default: errorText.addressLine1 },
        });
        validations.city = validate(staticFields.city, {
          errors: { default: errorText.addressCity },
        });
        validations.postCode = validate(staticFields.postCode, {
          errors: { default: errorText.addressPostcode },
        });
        break;
      case EMAIL:
        validations.email = validate(staticFields.email, {
          errors: { default: errorText.emailMissing, type: errorText.emailInvalid },
          type: 'email',
        });
        break;
      case SMS:
        validations.mobilePhone = validate(staticFields.mobilePhone, {
          errors: { default: errorText.mobileMissing, type: errorText.mobileInvalid },
          type: 'phoneNumber',
        });
        break;
      default:
    }
    // Validate merge fields
    this.props.substitutionFields.forEach(({ label, mandatory = false, key, validation }) => {
      const validationOptions = {
        errors: {},
      };
      validationOptions.notEmpty = mandatory;
      if (mandatory) {
        validationOptions.errors.default = format(errorText.mergeFieldMissingData, {
          field: label,
        });
      }
      if (validation) {
        validationOptions.errors.type = format(errorText.mergeFieldMissingDataInvalidData, {
          field: label,
        });
        validationOptions.pattern = getRegexFromRegexLiteral(validation);
        validationOptions.type = 'regex';
      }
      validations[`mergeFields.${key}`] = validate(this.state.mergeFields[key], validationOptions);
    });

    const validationFailed = compose(equals(false), prop('didValidate'));

    const anyValidationsFailed = any(validationFailed)(values(validations));
    this.props.validateHandler(!anyValidationsFailed);
    return {
      errors: validations,
      isValid: !anyValidationsFailed,
    };
  };

  resetStaticErrors(field) {
    this.setState({ errors: { ...this.state.errors, [field]: null } });
  }

  handleStaticInputChange = (staticKey, value) => {
    this.setState(
      prevState => ({
        staticFields: {
          ...prevState.staticFields,
          [staticKey]: value,
        },
      }),
      () => {
        this.resetStaticErrors(staticKey);
        this.validate();
      }
    );
  };

  previewSelectedTemplate = () => {
    const { closeTemplate, dataBddPrefix, templatePreviewImage } = this.props;
    const template = (
      <PreviewTemplate
        content={templatePreviewImage}
        dataBddPrefix={`${dataBddPrefix}-template`}
        onClose={closeTemplate}
        errorMessage={this.props.errorText.noTemplateFound}
        label={this.props.labels.closeTemplate}
        type={BASE64IMAGE}
      />
    );
    this.props.openTemplate({ template, limitMaxWidth: true });
  };

  render() {
    const {
      dataBddPrefix,
      generatePreviewSubmitText,
      chosenTemplateName,
      labels: { viewTemplate },
    } = this.props;
    const { errors } = this.state;
    return (
      <Fragment>
        <PreviewLinkContainer>
          <PreviewLink
            data-state-key={'previewLink'}
            data-bdd={`${dataBddPrefix}-previewLink`}
            onClick={this.previewSelectedTemplate}
            isText
          >
            {format(viewTemplate, { name: chosenTemplateName })}
          </PreviewLink>
        </PreviewLinkContainer>
        {this.staticFields()}
        {this.props.substitutionFields.map(({ key, label, mandatory }) => (
          <Field key={key}>
            <Input
              data-bdd={`${dataBddPrefix}-${key}`}
              data-state-key={key}
              disabled={this.disableForm()}
              error={errors[`mergeFields.${key}`]}
              id={`${key}`}
              isFullWidth
              labelText={label}
              onChange={this.updateMergeField(key)}
              required={mandatory}
              value={this.state.mergeFields[key] || ''}
            />
          </Field>
        ))}
        <GenerateDraftContainer>
          <GenerateDraftButton
            data-bdd={`${dataBddPrefix}-generateDraftCorrespondence`}
            data-state-key="generateDraftCorrespondenceButton"
            disabled={this.disableForm()}
            buttonType="primary"
            type="button"
            onClick={this.onGenerateDraft}
          >
            {generatePreviewSubmitText}
          </GenerateDraftButton>
        </GenerateDraftContainer>
      </Fragment>
    );
  }
}

GenerateCorrespondence.defaultProps = {
  generatePreviewLoading: false,
  templateId: '',
  templatePreviewImage: '',
};

GenerateCorrespondence.propTypes = {
  arrearsId: PropTypes.string.isRequired,
  chosenTemplateName: PropTypes.string.isRequired,
  closeTemplate: PropTypes.func.isRequired,
  dataBddPrefix: PropTypes.string.isRequired,
  errorText: errorTextLabels.isRequired,
  generateDraft: PropTypes.func.isRequired,
  generatePreviewSubmitText: PropTypes.string.isRequired,
  labels: labelsPropTypes.isRequired,
  openTemplate: PropTypes.func.isRequired,
  recipient: PropTypes.string.isRequired,
  retriableError: PropTypes.bool.isRequired,
  sendingMethod: PropTypes.string.isRequired,
  substitutionFields: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      key: PropTypes.string,
      label: PropTypes.string,
      mandatory: PropTypes.bool,
      validation: PropTypes.string,
    })
  ).isRequired,
  validateHandler: PropTypes.func.isRequired,
  generatePreviewLoading: PropTypes.bool,
  templateId: PropTypes.string,
  templatePreviewImage: PropTypes.string,
};

export default GenerateCorrespondence;
