import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  formatting,
  Loader,
  paragraphify,
  Radio,
  RadioGroup,
  Textarea,
  Typography,
  validate,
} from 'nhh-styles';

import { FieldRow, FormWrapper } from '../../components';
import { PageContent } from '../';
import connect from './connect';

const initialState = {
  approvePause: null,
  errors: {},
  isDirty: {},
  reasonForDenying: '',
};

export class ApprovePauseComposition extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { ...initialState, formError: props.formError };
  }

  componentDidMount() {
    const { getPause, updatePageHeader } = this.props;
    updatePageHeader();
    getPause();
  }

  handleBackClick = () => {
    this.resetForm();
    this.props.onBack();
  };

  handleFieldChange = (field, value) => {
    const cloneState = { ...this.state };
    this.setState(
      {
        formError: false,
        [field]: value,
        isDirty: {
          ...cloneState.isDirty,
          [field]: true,
        },
      },
      this.validateForm
    );
  };

  handleFormSubmit = ev => {
    ev.preventDefault();
    const { onSubmit } = this.props;
    const { reasonForDenying } = this.state;
    this.setState(
      {
        isDirty: {
          reasonForDenying: true,
        },
      },
      () => {
        const isValid = this.validateForm();
        if (isValid) {
          onSubmit(reasonForDenying);
          this.resetForm();
        }
      }
    );
  };

  resetForm = () => {
    this.setState({ ...initialState });
  };

  validateForm = () => {
    const { approvePause, isDirty, reasonForDenying } = this.state;
    const {
      errorText: { approvePauseError, reasonForDenyingError },
    } = this.props;

    const isDenied = approvePause === 'no';

    const approvalValidation = validate(approvePause, {
      errors: { default: approvePauseError },
    });

    const reasonValidation = validate(reasonForDenying, {
      errors: { default: reasonForDenyingError },
    });

    this.setState({
      errors: {
        approvePause: approvalValidation.message,
        reasonForDenying: isDirty.reasonForDenying && isDenied ? reasonValidation.message : '',
      },
    });

    return approvalValidation.didValidate && !(isDenied && !reasonValidation.didValidate);
  };

  render() {
    const {
      activePause,
      errorText: { formError: formErrorMessage },
      formError,
      labels: {
        approvePause: approvePauseLabel,
        backButton,
        furtherDetail,
        no,
        reasonForDenying: reasonForDenyingLabel,
        reasonForPausing,
        requestedEndDate,
        submitButton,
        yes,
      },
      loading,
      rules,
    } = this.props;

    const { approvePause, reasonForDenying, errors } = this.state;

    return (
      <PageContent>
        {loading || !activePause ? (
          <Loader />
        ) : (
          <div className="col-lg-9">
            <FormWrapper
              backButtonText={backButton}
              formError={formError ? formErrorMessage : ''}
              formName="approvePause"
              handleBackClick={this.handleBackClick}
              handleFormSubmit={this.handleFormSubmit}
              submitButtonText={submitButton}
            >
              <FieldRow>
                <Typography.Label data-bdd="approvePause-reasonForPausing-label">
                  {reasonForPausing}
                </Typography.Label>
                <Typography.P data-bdd="approvePause-reasonForPausing-value">
                  {(rules.find(rule => rule.id === activePause.reasonId) || {}).title}
                </Typography.P>
              </FieldRow>
              <FieldRow>
                <Typography.Label data-bdd="approvePause-requestedEndDate-label">
                  {requestedEndDate}
                </Typography.Label>
                <Typography.P data-bdd="approvePause-requestedEndDate-value">
                  {formatting.formatDate(activePause.endDate)}
                </Typography.P>
              </FieldRow>
              <FieldRow>
                <Typography.Label data-bdd="approvePause-furtherDetail-label">
                  {furtherDetail}
                </Typography.Label>
                {paragraphify(activePause.furtherDetail)}
              </FieldRow>
              <FieldRow>
                <RadioGroup error={errors.approvePause} labelText={approvePauseLabel} required>
                  <Radio
                    checked={approvePause === 'yes'}
                    data-bdd="approvePause-radioGroup-yes"
                    display="block"
                    id="yes"
                    name="approvePauseGroup"
                    onChange={() => this.handleFieldChange('approvePause', 'yes')}
                  >
                    {yes}
                  </Radio>
                  <Radio
                    checked={approvePause === 'no'}
                    data-bdd="approvePause-radioGroup-no"
                    display="block"
                    id="no"
                    name="approvePauseGroup"
                    onChange={() => this.handleFieldChange('approvePause', 'no')}
                  >
                    {no}
                  </Radio>
                </RadioGroup>
              </FieldRow>
              {approvePause === 'no' && (
                <FieldRow>
                  <Textarea
                    data-bdd="approvePause-reasonForDenying"
                    error={errors.reasonForDenying}
                    id="reasonForDenying"
                    onChange={ev => this.handleFieldChange('reasonForDenying', ev.target.value)}
                    labelText={reasonForDenyingLabel}
                    value={reasonForDenying}
                    isFullWidth
                    required
                  />
                </FieldRow>
              )}
            </FormWrapper>
          </div>
        )}
      </PageContent>
    );
  }
}

ApprovePauseComposition.defaultProps = {
  activePause: null,
  formError: false,
  loading: false,
  rules: [],
};

ApprovePauseComposition.propTypes = {
  errorText: PropTypes.shape({
    approvePauseError: PropTypes.string.isRequired,
    formError: PropTypes.string.isRequired,
    reasonForDenyingError: PropTypes.string.isRequired,
  }).isRequired,
  getPause: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    approvePause: PropTypes.string.isRequired,
    backButton: PropTypes.string.isRequired,
    furtherDetail: PropTypes.string.isRequired,
    no: PropTypes.string.isRequired,
    reasonForDenying: PropTypes.string.isRequired,
    reasonForPausing: PropTypes.string.isRequired,
    requestedEndDate: PropTypes.string.isRequired,
    submitButton: PropTypes.string.isRequired,
    yes: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  activePause: PropTypes.shape({
    endDate: PropTypes.string.isRequired,
    furtherDetail: PropTypes.string.isRequired,
    reasonId: PropTypes.string.isRequired,
  }),
  formError: PropTypes.bool,
  loading: PropTypes.bool,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
};

export default withRouter(connect(ApprovePauseComposition));
