import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Button,
  DateInput,
  formatting,
  Loader,
  NotificationPanel,
  Select,
  Textarea,
  Typography,
  validate,
} from 'nhh-styles';
import format from 'string-format';
import startOfToday from 'date-fns/start_of_today';
import moment from 'moment';

import connect from './connect';
import { FieldRow, FormWrapper } from '../../components';
import { PageContent } from '../';

import { Row } from './components';

import { DRAFT } from '../../constants/pause';

const initialState = {
  errors: {},
  endDate: null,
  furtherDetail: null,
  isDirty: {},
  isManagerNotified: false,
  pauseDetails: null,
  pauseRule: null,
  isFormDisabled: false,
};

export class PauseArrearsCaseComposition extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { ...initialState, ...props.activePause, formError: props.formError };
  }

  componentDidMount() {
    const { getPause, updatePageHeader } = this.props;
    this.resetForm();
    updatePageHeader();
    getPause();
  }

  componentWillReceiveProps(nextProps) {
    const { activePause, rules } = nextProps;
    if ((activePause !== this.props.activePause || rules !== this.props.rules) && rules.length) {
      const pauseRule = activePause ? rules.find(rule => rule.id === activePause.reasonId) : null;
      this.setState({ ...activePause, pauseRule });
      if (pauseRule) {
        const cloneState = { ...this.state };
        this.setState(
          {
            ...activePause,
            pauseRule,
            isDirty: {
              ...cloneState.isDirty,
              endDate: true,
            },
          },
          this.enableOrDisableForm
        );
      }
    }
  }

  componentWillUnmount() {
    const { clearError } = this.props;
    clearError();
  }

  handleBackClick = () => {
    this.resetForm();
    this.props.onBack();
  };

  handleCancelPause = () => {
    this.resetForm();
    this.props.onCancel();
  };

  handleFieldChange = ev => {
    if (ev.preventDefault) ev.preventDefault();
    const cloneState = { ...this.state };
    this.setState(
      {
        formError: false,
        [ev.target.id]: ev.target.value,
        isDirty: {
          ...cloneState.isDirty,
          [ev.target.id]: true,
        },
      },
      this.enableOrDisableForm
    );
  };

  handleFormSubmit = ev => {
    ev.preventDefault();
    const { activePause, onSubmit } = this.props;
    const {
      errors: { extendedPauseDate },
      endDate,
      pauseDetails,
      isManagerNotified,
      pauseRule,
    } = this.state;
    this.setState(
      {
        isDirty: {
          endDate: true,
          pauseDetails: true,
          isManagerNotified: true,
          pauseRule: true,
        },
      },
      () => {
        const isValid = this.validateForm();
        if (isValid) {
          onSubmit(
            {
              notifyManager: isManagerNotified,
              requireManagerApproval: !!extendedPauseDate && extendedPauseDate.type === 'myRule',
              reasonId: pauseRule.id,
              endDate,
              description: pauseDetails,
            },
            !!activePause
          );
          this.resetForm();
        }
      }
    );
  };

  enableOrDisableForm = () => {
    this.setState({
      isFormDisabled: !this.validateForm(),
    });
  };

  resetForm = () => {
    this.setState({ ...initialState });
  };

  validateForm = () => {
    const { isDirty, endDate, pauseDetails, isManagerNotified, pauseRule } = this.state;
    const {
      errorText: {
        endDateError,
        extendedEndDateError,
        furtherDetailError,
        notifyManagerError,
        reasonForPausingError,
      },
    } = this.props;

    const reasonValidation = validate(pauseRule, {
      errors: { default: reasonForPausingError },
    });
    const dateValidation = validate(endDate, {
      type: 'date',
      errors: { default: endDateError },
    });
    const detailsValidation = validate(pauseDetails, {
      errors: { default: furtherDetailError },
    });

    const extendedDateValidation = this.validatePauseDate();
    let dateValidationMessage = dateValidation.message;

    const notifyManagerValidation = { didValidate: true, message: '' };
    if (!extendedDateValidation.didValidate) {
      notifyManagerValidation.didValidate = isManagerNotified;
      notifyManagerValidation.message = isManagerNotified ? '' : notifyManagerError;
      if (extendedDateValidation.type === 'managerRule') {
        dateValidationMessage = extendedEndDateError;
      }
    }
    this.setState({
      errors: {
        extendedPauseDate: isDirty.endDate && extendedDateValidation,
        endDate: isDirty.endDate && dateValidationMessage,
        pauseDetails: isDirty.pauseDetails && detailsValidation.message,
        pauseRule: isDirty.pauseRule && reasonValidation.message,
        isManagerNotified: isDirty.isManagerNotified && notifyManagerValidation.message,
      },
    });

    if (
      !dateValidation.didValidate ||
      !detailsValidation.didValidate ||
      !reasonValidation.didValidate ||
      !notifyManagerValidation.didValidate
    ) {
      return false;
    }

    if (!extendedDateValidation.didValidate && extendedDateValidation.type === 'managerRule') {
      return false;
    }

    return true;
  };

  validatePauseDate = () => {
    const { endDate, pauseRule } = this.state;
    const {
      errorText: { outsideManagerPause, outsideSeniorManagerPause, outsideMyPause },
      roles,
    } = this.props;

    let result = {
      didValidate: true,
      message: '',
    };

    if (!endDate || !pauseRule) return result;

    const selectedDate = moment(endDate);
    const {
      managerRule: { endDate: managerEndDate },
      myRule: { endDate: myEndDate },
    } = pauseRule;

    if (selectedDate.isAfter(myEndDate)) {
      result = {
        didValidate: false,
        message: outsideMyPause,
        type: 'myRule',
      };
    }

    if (selectedDate.isAfter(managerEndDate)) {
      result = {
        didValidate: false,
        message: roles.isSeniorManager ? outsideSeniorManagerPause : outsideManagerPause,
        type: 'managerRule',
      };
    }

    if (this.props.activePause && !this.state.isDirty.isManagerNotified)
      this.setState({ isManagerNotified: !result.didValidate });

    return result;
  };

  render() {
    const {
      activePause,
      errorText: { formError: formErrorMessage },
      formError,
      labels: {
        awaitingApproval,
        backButton,
        cancelButton,
        endDate,
        furtherDetail: furtherDetailLabel,
        furtherDetailAdd,
        managerPause,
        myPause,
        notifyManager,
        notifyManagerExtended,
        pleaseNote,
        reasonForPausing,
        submitButton,
        updateButton,
      },
      loading,
      rules,
      roles,
    } = this.props;
    const { endDate: endDateVal, errors, furtherDetail, isManagerNotified, pauseRule } = this.state;
    const dateInvalid = !!errors.extendedPauseDate && !errors.extendedPauseDate.didValidate;
    const defaultReason = pauseRule ? { defaultInputValue: pauseRule.title } : {};
    const defaultDate = endDateVal ? { defaultDate: new Date(endDateVal) } : {};
    const isDraft = activePause && activePause.status === DRAFT;

    // certain elements on the page should be visible/hidden depending on user role
    const shouldSeeManagerDateRule = !roles.isSeniorManager;
    const canNotifyManager = !roles.isSeniorManager;

    return (
      <PageContent>
        {loading ? (
          <Loader />
        ) : (
          <div className="col-lg-9">
            {isDraft && (
              <Row data-bdd="pauseArrearsCase-awaitingApprovalAlert">
                <NotificationPanel
                  icon="warning"
                  title={awaitingApproval}
                  description={pleaseNote}
                  hideCloseButton
                  show
                />
              </Row>
            )}
            <FormWrapper
              backButtonText={backButton}
              formError={formError ? formErrorMessage : ''}
              formName="pauseArrearsCase"
              handleBackClick={this.handleBackClick}
              handleFormSubmit={this.handleFormSubmit}
              submitButtonText={activePause ? updateButton : submitButton}
              disableSubmit={this.state.isFormDisabled}
              otherActions={
                activePause ? (
                  <Button
                    buttonType="tertiary"
                    data-bdd={`pauseArrearsCase-cancel`}
                    onClick={this.handleCancelPause}
                    type="button"
                    isFullWidth
                  >
                    {cancelButton}
                  </Button>
                ) : null
              }
            >
              <FieldRow>
                <Select
                  dataBdd="pauseArrearsCase-selectReason"
                  error={errors.pauseRule}
                  isFullWidth
                  items={rules}
                  itemToString={item => (item ? item.title : '')}
                  labelText={reasonForPausing}
                  onChange={value => this.handleFieldChange({ target: { id: 'pauseRule', value } })}
                  required
                  {...defaultReason}
                />
              </FieldRow>

              {pauseRule && (
                <div>
                  <Typography.Label data-bdd="pauseArrearsCase-selectDate-label">
                    {endDate}
                  </Typography.Label>
                  <Typography.P>
                    <span data-bdd="pauseArrearsCase-selectDate-myDate">
                      {format(myPause, { date: formatting.formatDate(pauseRule.myRule.endDate) })}
                    </span>
                    <br />
                    {shouldSeeManagerDateRule && (
                      <span data-bdd="pauseArrearsCase-selectDate-managerDate">
                        {format(managerPause, {
                          date: formatting.formatDate(pauseRule.managerRule.endDate),
                        })}
                      </span>
                    )}
                  </Typography.P>
                  <FieldRow data-bdd="pauseArrearsCase-selectDate">
                    <DateInput
                      error={errors.endDate}
                      minDate={startOfToday()}
                      onDateSelected={(value, formatted) =>
                        this.handleFieldChange({ target: { id: 'endDate', value: formatted } })
                      }
                      isFullWidth
                      required
                      {...defaultDate}
                    />
                  </FieldRow>
                  {dateInvalid && (
                    <Row data-bdd="pauseArrearsCase-dateAlert">
                      <NotificationPanel
                        icon="warning"
                        description={format(errors.extendedPauseDate.message, {
                          date: formatting.formatDate(
                            pauseRule[errors.extendedPauseDate.type].endDate
                          ),
                        })}
                        hideCloseButton
                        show
                      />
                    </Row>
                  )}
                  {furtherDetail && (
                    <FieldRow>
                      <Typography.Label data-bdd="pauseArrearsCase-existingDetails-label">
                        {furtherDetailLabel}
                      </Typography.Label>
                      <Typography.P>
                        <span data-bdd="pauseArrearsCase-existingDetails">{furtherDetail}</span>
                      </Typography.P>
                    </FieldRow>
                  )}
                  <FieldRow>
                    <Textarea
                      data-bdd="pauseArrearsCase-furtherDetails"
                      error={errors.pauseDetails}
                      id="pauseDetails"
                      onChange={this.handleFieldChange}
                      labelText={activePause ? furtherDetailAdd : furtherDetailLabel}
                      isFullWidth
                      required
                    />
                  </FieldRow>
                  {canNotifyManager && (
                    <Row>
                      <Checkbox
                        data-bdd="pauseArrearsCase-notifyManager"
                        error={errors.isManagerNotified}
                        onChange={() =>
                          this.handleFieldChange({
                            target: { id: 'isManagerNotified', value: !isManagerNotified },
                          })
                        }
                        required={dateInvalid}
                        checked={isManagerNotified}
                      >
                        {dateInvalid ? notifyManagerExtended : notifyManager}
                      </Checkbox>
                    </Row>
                  )}
                </div>
              )}
            </FormWrapper>
          </div>
        )}
      </PageContent>
    );
  }
}

PauseArrearsCaseComposition.defaultProps = {
  activePause: null,
  formError: false,
  loading: false,
  rules: [],
};

PauseArrearsCaseComposition.propTypes = {
  clearError: PropTypes.func.isRequired,
  errorText: PropTypes.shape({
    endDateError: PropTypes.string.isRequired,
    extendedEndDateError: PropTypes.string.isRequired,
    formError: PropTypes.string.isRequired,
    furtherDetailError: PropTypes.string.isRequired,
    notifyManagerError: PropTypes.string.isRequired,
    outsideManagerPause: PropTypes.string.isRequired,
    outsideMyPause: PropTypes.string.isRequired,
    outsideSeniorManagerPause: PropTypes.string.isRequired,
    reasonForPausingError: PropTypes.string.isRequired,
  }).isRequired,
  getPause: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    awaitingApproval: PropTypes.string.isRequired,
    backButton: PropTypes.string.isRequired,
    cancelButton: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    furtherDetail: PropTypes.string.isRequired,
    furtherDetailAdd: PropTypes.string.isRequired,
    managerPause: PropTypes.string.isRequired,
    myPause: PropTypes.string.isRequired,
    notifyManager: PropTypes.string.isRequired,
    notifyManagerExtended: PropTypes.string.isRequired,
    reasonForPausing: PropTypes.string.isRequired,
    submitButton: PropTypes.string.isRequired,
    updateButton: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  roles: PropTypes.shape({
    isSeniorManager: PropTypes.bool,
  }).isRequired,
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
      managerRule: PropTypes.shape({
        endDate: PropTypes.string.isRequired,
      }).isRequired,
      myRule: PropTypes.shape({
        endDate: PropTypes.string.isRequired,
      }).isRequired,
      title: PropTypes.string.isRequired,
    })
  ),
};

export default connect(PauseArrearsCaseComposition);
