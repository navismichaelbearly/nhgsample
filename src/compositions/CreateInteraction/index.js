import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  DateInput,
  InputLabel,
  Radio,
  RadioGroup,
  Select,
  Textarea,
  TimeInput,
  Typography,
  validate,
  Checkbox,
  Button,
} from 'nhh-styles';
import { withTheme } from 'styled-components';
import any from 'ramda/src/any';
import compose from 'ramda/src/compose';
import equals from 'ramda/src/equals';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import values from 'ramda/src/values';
import isSameDay from 'date-fns/is_same_day';
import isBefore from 'date-fns/is_before';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

import { PageContent } from '../';
import connect from './connect';
import { FieldRow, FormWrapper } from '../../components';
import timeNow from '../../util/timeNow';

import { DateTimeContainer, WarningContainer } from './components';

const dataBddPrefix = 'addInteraction';

const initialState = {
  activityKind: '',
  description: '',
  errors: {},
  interactingParty: '',
  interactionDate: '',
  interactionTime: '',
  interactionType: '',
  wantsToAttachMedia: false,
};

export class CreateInteractionCompositions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    const {
      getActivityTypes,
      getTenantDetails,
      updatePageHeader,
      thirdParty: { thirdParties, getThirdParties },
    } = this.props;
    updatePageHeader();
    getActivityTypes();
    getTenantDetails();
    if (!thirdParties) getThirdParties();
  }

  componentWillUnmount() {
    const { clearError } = this.props;
    clearError();
  }

  onAttachMedia = () => {
    this.setState({
      wantsToAttachMedia: !this.state.wantsToAttachMedia,
    });
  };

  resetErrors(value) {
    this.setState({ errors: { ...this.state.errors, [value]: null } });
  }

  handleSubmitAndRedirectToAddTask = eve => {
    this.handleSubmit(eve, '/task/create');
  };

  handleSubmit = (eve, redirectToPage) => {
    eve.preventDefault();
    // validation
    const validation = this.validate();
    if (validation.isValid) {
      const {
        activityKind,
        description,
        interactingParty,
        interactionType,
        interactionDate,
        interactionTime,
        wantsToAttachMedia,
      } = this.state;

      this.props.onSubmit(
        {
          activityKind,
          date: interactionDate,
          description,
          interactionType,
          interactingParty,
          time: interactionTime,
        },
        redirectToPage,
        wantsToAttachMedia
      );
    } else {
      this.setState({
        errors: {
          description: path(['errors', 'description', 'message'], validation),
          activityKind: path(['errors', 'activityKind', 'message'], validation),
          interactingParty: path(['errors', 'interactingParty', 'message'], validation),
          interactionDate: path(['errors', 'interactionDate', 'message'], validation),
          interactionTime: path(['errors', 'interactionTime', 'message'], validation),
          interactionType: path(['errors', 'interactionType', 'message'], validation),
        },
      });
    }
  };

  updateInputState = ({ target: { dataset, value } }) => {
    this.setState({ [dataset.stateKey]: value }, this.resetErrors([dataset.stateKey]));
  };

  validate = () => {
    const { errorText } = this.props;
    const validations = {};
    [
      'description',
      'activityKind',
      'interactingParty',
      'interactionDate',
      'interactionTime',
      'interactionType',
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
      activityKinds,
      activityTypes,
      error,
      errorText: { interactionDateOrTime: interactionDateOrTimeError },
      formError,
      labels: {
        backButton,
        description: descriptionLabel,
        interactionDateAndTime: interactionDateAndTimeLabel,
        interactionType: interactionTypeLabel,
        interactingParty: interactingPartyLabel,
        submitButton,
        submitAndCreateTaskButton,
        attachMedia,
      },
      onBack,
      tenants,
      timeSlots,
      thirdParty: { thirdParties, thirdPartyLabel, thirdPartiesError, thirdPartyErrorText },
      isLoading,
    } = this.props;

    const { activityKind, description, errors, interactionType, interactingParty } = this.state;

    const today = timeNow();

    // if the chosen date is today's date, make
    // sure that times in the dropdown
    // are before time now
    const isBeforeNow = time => {
      if (!this.state.interactionDate) {
        return true;
      }

      const parsedInteractionDate = parse(this.state.interactionDate);

      if (isSameDay(parsedInteractionDate, today)) {
        const [hour, minute] = time.split(':');
        const parsedTime = parse(`${format(today, 'YYYY-MM-DDT')}${hour}:${minute}:00`);

        return isBefore(parsedTime, today);
      }

      return true;
    };

    const submitAndCreateTaskButtonNode = (
      <Button
        data-bdd={'createInteraction-submit-and-create-task'}
        onClick={this.handleSubmitAndRedirectToAddTask}
      >
        {submitAndCreateTaskButton}
      </Button>
    );

    const parties = thirdParties
      ? [...tenants, { ...thirdParties, name: thirdPartyLabel }]
      : tenants;

    return (
      <PageContent>
        <div className="col-lg-9">
          <FormWrapper
            backButtonText={backButton}
            loading={isLoading}
            formError={error ? formError : null}
            formName="createInteraction"
            handleBackClick={onBack}
            handleFormSubmit={this.handleSubmit}
            submitButtonText={submitButton}
            otherActions={submitAndCreateTaskButtonNode}
          >
            <FieldRow>
              <Select
                disabled={isLoading}
                dataBdd={`${dataBddPrefix}-interactionType`}
                data-state-key="interactionType"
                error={errors.interactionType}
                isFullWidth
                items={activityTypes}
                itemToString={item => (item ? item.name : '')}
                labelText={interactionTypeLabel}
                onChange={({ name }) =>
                  this.updateInputState({
                    target: { dataset: { stateKey: 'interactionType' }, value: name },
                  })
                }
                required
                inputValue={interactionType}
              />
            </FieldRow>
            <FieldRow>
              <RadioGroup error={errors.activityKind} required name="activityKind">
                {activityKinds.map(name => (
                  <Radio
                    disabled={isLoading}
                    key={name}
                    checked={activityKind === name}
                    data-bdd={`${dataBddPrefix}-activityKind-${name}`}
                    data-state-key="activityKind"
                    id={name}
                    onChange={() =>
                      this.updateInputState({
                        target: { dataset: { stateKey: 'activityKind' }, value: name },
                      })
                    }
                  >
                    {name}
                  </Radio>
                ))}
              </RadioGroup>
            </FieldRow>
            <InputLabel showLabel required>
              {interactingPartyLabel}
            </InputLabel>
            <FieldRow>
              {thirdPartiesError && <WarningContainer>{thirdPartyErrorText}</WarningContainer>}
              <RadioGroup error={errors.interactingParty} required name="interactingParty">
                {parties.map(({ id, name }) => (
                  <Radio
                    disabled={isLoading}
                    display="block"
                    key={id}
                    checked={interactingParty === id}
                    data-bdd={`${dataBddPrefix}-interactingParty-${id}`}
                    data-state-key="interactingParty"
                    id={id}
                    onChange={() =>
                      this.updateInputState({
                        target: { dataset: { stateKey: 'interactingParty' }, value: id },
                      })
                    }
                  >
                    {name}
                  </Radio>
                ))}
              </RadioGroup>
            </FieldRow>
            <InputLabel showLabel required>
              {interactionDateAndTimeLabel}
            </InputLabel>
            <FieldRow data-bdd={`${dataBddPrefix}-interactionDate`}>
              <DateTimeContainer>
                <DateInput
                  disabled={isLoading}
                  data-state-key="interactionDate"
                  hasError={!!errors.interactionDate}
                  maxDate={today}
                  onDateSelected={(value, formatted) => {
                    this.updateInputState({
                      target: { dataset: { stateKey: 'interactionDate' }, value: formatted },
                    });
                  }}
                  isFullWidth
                  required
                />
                <TimeInput
                  disabled={isLoading}
                  dataBdd={`${dataBddPrefix}-interactionTime`}
                  data-state-key="interactionTime"
                  hasError={!!errors.interactionTime}
                  items={timeSlots.filter(isBeforeNow)}
                  value={this.state.interactionTime}
                  onChange={value =>
                    this.updateInputState({
                      target: { dataset: { stateKey: 'interactionTime' }, value },
                    })
                  }
                  placeholder="Time"
                />
              </DateTimeContainer>
              <React.Fragment>
                {(!!errors.interactionDate || !!errors.interactionTime) && (
                  <Typography.Error data-bdd={`${dataBddPrefix}-dateOrTimeError`}>
                    {interactionDateOrTimeError}
                  </Typography.Error>
                )}
              </React.Fragment>
            </FieldRow>
            <FieldRow>
              <Textarea
                disabled={isLoading}
                data-bdd={`${dataBddPrefix}-description`}
                data-state-key={'description'}
                error={errors.description}
                id="description"
                labelText={descriptionLabel}
                onChange={this.updateInputState}
                required
                isFullWidth
                value={description}
              />
            </FieldRow>
            <FieldRow>
              <Checkbox
                disabled={isLoading}
                data-bdd="addInteractionForm-attachMedia"
                data-state-key={'attachMedia'}
                checked={this.state.wantsToAttachMedia}
                onChange={this.onAttachMedia}
              >
                {attachMedia}
              </Checkbox>
            </FieldRow>
          </FormWrapper>
        </div>
      </PageContent>
    );
  }
}

CreateInteractionCompositions.defaultProps = {
  thirdParty: { thirdParties: undefined },
};

CreateInteractionCompositions.propTypes = {
  activityKinds: PropTypes.array.isRequired,
  activityTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  clearError: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  errorText: PropTypes.shape({
    activityKind: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    interactingParty: PropTypes.string.isRequired,
    interactionDate: PropTypes.string.isRequired,
    interactionTime: PropTypes.string.isRequired,
    interactionType: PropTypes.string.isRequired,
  }).isRequired,
  formError: PropTypes.string.isRequired,
  getActivityTypes: PropTypes.func.isRequired,
  getTenantDetails: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  labels: PropTypes.shape({
    attachMedia: PropTypes.string.isRequired,
    backButton: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  tenants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  thirdParty: PropTypes.shape({
    getThirdParties: PropTypes.func,
    thirdParties: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    thirdPartiesError: PropTypes.bool,
    thirdPartyErrorText: PropTypes.string,
    thirdPartyLabel: PropTypes.string,
  }).isRequired,
  timeSlots: PropTypes.array.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
};

export default connect(withTheme(CreateInteractionCompositions));
