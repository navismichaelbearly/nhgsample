import startOfToday from 'date-fns/start_of_today';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  DateInput,
  Input,
  Radio,
  RadioGroup,
  Select,
  Textarea,
  Checkbox,
  validate,
} from 'nhh-styles';
import any from 'ramda/src/any';
import compose from 'ramda/src/compose';
import equals from 'ramda/src/equals';
import map from 'ramda/src/map';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import range from 'ramda/src/range';
import values from 'ramda/src/values';
import toString from 'ramda/src/toString';
import { PageContent } from '../';
import connect from './connect';
import { FieldRow, FormWrapper } from '../../components';

const dataBddPrefix = 'createPaymentPlan';

const initialState = {
  wantsToAttachFiles: false,
  errors: {},
  installmentAmount: '',
  installmentPeriod: '',
  installmentFrequency: '',
  planType: '',
  startDate: '',
  note: '',
};

export class CreatePaymentPlanCompositions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const { updatePageHeader } = this.props;
    updatePageHeader();
  }

  componentWillUnmount() {
    const { clearError } = this.props;
    clearError();
  }

  onAttachFiles = () =>
    this.setState({
      wantsToAttachFiles: !this.state.wantsToAttachFiles,
    });

  resetErrors(val) {
    this.setState({ errors: { ...this.state.errors, [val]: null } });
  }

  handleSubmit = eve => {
    eve.preventDefault();
    // validation
    const validation = this.validate();
    if (validation.isValid) {
      const {
        installmentAmount,
        installmentPeriod,
        installmentFrequency,
        planType,
        startDate,
        note,
        wantsToAttachFiles,
      } = this.state;
      this.props.onSubmit(
        {
          description: note,
          installment: {
            amount: installmentAmount,
            period: installmentFrequency,
            schedule: installmentPeriod,
          },
          startDate,
          type: planType,
        },
        wantsToAttachFiles
      );
    } else {
      this.setState({
        errors: {
          installmentAmount: path(['errors', 'installmentAmount', 'message'], validation),
          installmentFrequency: path(['errors', 'installmentFrequency', 'message'], validation),
          installmentPeriod: path(['errors', 'installmentPeriod', 'message'], validation),
          note: path(['errors', 'note', 'message'], validation),
          planType: path(['errors', 'planType', 'message'], validation),
          startDate: path(['errors', 'startDate', 'message'], validation),
        },
      });
    }
  };

  updateInputState = ({ target: { dataset, value } }) => {
    this.setState({ [dataset.stateKey]: value }, this.resetErrors(dataset.stateKey));
  };

  validate = () => {
    const { errorText } = this.props;
    const { installmentAmount } = this.state;
    const validations = {};
    validations.installmentAmount = validate(installmentAmount, {
      type: 'currency',
      errors: {
        default: errorText.installmentAmount,
        type: errorText.installmentAmountNotNumber,
      },
    });
    [
      'installmentFrequency',
      'installmentPeriod',
      'installmentPeriod',
      'planType',
      'startDate',
    ].forEach(d => {
      validations[d] = validate(this.state[d], {
        errors: { default: errorText[d] },
      });
    });

    const validationFailed = compose(equals(false), prop('didValidate'));

    const anyValidationsFailed = any(validationFailed)(values(validations));

    return {
      errors: validations,
      isValid: !anyValidationsFailed,
    };
  };

  render() {
    const {
      currencySymbol,
      error,
      formError,
      installmentPeriods,
      labels: {
        backButton,
        installmentAmount: installmentAmountLabel,
        installmentPeriod: installmentPeriodLabel,
        installmentFrequency: installmentFrequencyLabel,
        note: noteLabel,
        paymentPlanType,
        startDate: startDateLabel,
        submitButton,
        attachFile,
      },
      onBack,
      planFrequency,
      planTypes,
      isLoading,
    } = this.props;

    const {
      errors,
      installmentAmount,
      installmentFrequency,
      installmentPeriod,
      note,
      planType,
      wantsToAttachFiles,
    } = this.state;

    return (
      <PageContent>
        <div className="col-lg-9">
          <FormWrapper
            backButtonText={backButton}
            formError={error ? formError : null}
            formName="createPaymentPlan"
            handleBackClick={onBack}
            handleFormSubmit={this.handleSubmit}
            submitButtonText={submitButton}
            loading={isLoading}
          >
            <FieldRow>
              <RadioGroup
                error={errors.planType}
                labelText={paymentPlanType}
                required
                name="planType"
              >
                {planTypes.map(({ id, value }) => (
                  <Radio
                    disabled={isLoading}
                    key={id}
                    checked={planType === id}
                    data-bdd={`${dataBddPrefix}-paymentPlanType-${id}`}
                    data-state-key="planType"
                    display="block"
                    id={id}
                    onChange={() =>
                      this.updateInputState({
                        target: { dataset: { stateKey: 'planType' }, value: id },
                      })
                    }
                  >
                    {value}
                  </Radio>
                ))}
              </RadioGroup>
            </FieldRow>
            <FieldRow>
              <Input
                disabled={isLoading}
                data-bdd={`${dataBddPrefix}-instalmentAmount`}
                data-state-key="installmentAmount"
                id="installmentAmount"
                name="installmentAmount"
                isFullWidth
                required
                labelText={`${installmentAmountLabel} (${currencySymbol})`}
                onChange={this.updateInputState}
                value={installmentAmount}
                error={errors.installmentAmount}
              />
            </FieldRow>
            <FieldRow>
              <Select
                disabled={isLoading}
                dataBdd={`${dataBddPrefix}-instalmentPeriod`}
                data-state-key="installmentPeriod"
                error={errors.installmentPeriod}
                isFullWidth
                items={installmentPeriods}
                itemToString={item => (item ? item.value : '')}
                labelText={installmentPeriodLabel}
                onChange={({ id }) =>
                  this.updateInputState({
                    target: { dataset: { stateKey: 'installmentPeriod' }, value: id },
                  })
                }
                required
                inputValue={installmentPeriod}
              />
            </FieldRow>
            <FieldRow>
              <Select
                disabled={isLoading}
                dataBdd={`${dataBddPrefix}-instalmentFrequency`}
                data-state-key="installmentFrequency"
                error={errors.installmentFrequency}
                isFullWidth
                items={map(toString, range(1, planFrequency + 1))}
                itemToString={item => item}
                labelText={installmentFrequencyLabel}
                onChange={value =>
                  this.updateInputState({
                    target: { dataset: { stateKey: 'installmentFrequency' }, value },
                  })
                }
                required
                inputValue={installmentFrequency}
              />
            </FieldRow>
            <FieldRow data-bdd={`${dataBddPrefix}-startDate`}>
              <DateInput
                disabled={isLoading}
                data-state-key="startDate"
                error={errors.startDate}
                labelText={startDateLabel}
                minDate={startOfToday()}
                onDateSelected={(value, formatted) =>
                  this.updateInputState({
                    target: { dataset: { stateKey: 'startDate' }, value: formatted },
                  })
                }
                isFullWidth
                required
              />
            </FieldRow>
            <FieldRow>
              <Textarea
                disabled={isLoading}
                data-bdd={`${dataBddPrefix}-note`}
                data-state-key={'note'}
                error={errors.note}
                id="note"
                labelText={noteLabel}
                onChange={this.updateInputState}
                isFullWidth
                value={note}
              />
            </FieldRow>
            <FieldRow>
              <Checkbox
                data-bdd="addNoteForm-attachFiles"
                data-state-key={'attachFiles'}
                onChange={this.onAttachFiles}
                checked={wantsToAttachFiles}
              >
                {attachFile}
              </Checkbox>
            </FieldRow>
          </FormWrapper>
        </div>
      </PageContent>
    );
  }
}

CreatePaymentPlanCompositions.propTypes = {
  clearError: PropTypes.func.isRequired,
  currencySymbol: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  errorText: PropTypes.shape({
    installmentAmount: PropTypes.string.isRequired,
    installmentAmountNotNumber: PropTypes.string.isRequired,
    installmentFrequency: PropTypes.string.isRequired,
    installmentPeriod: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
    planType: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
  }).isRequired,
  formError: PropTypes.string.isRequired,
  installmentPeriods: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
  labels: PropTypes.shape({
    attachFile: PropTypes.string.isRequired,
    backButton: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired, // eslint-disable-line
  planFrequency: PropTypes.number.isRequired,
  planTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  updatePageHeader: PropTypes.func.isRequired,
};

export default connect(CreatePaymentPlanCompositions);
