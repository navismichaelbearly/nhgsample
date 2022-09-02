import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import {
  ActionButtonsWrapper,
  Button,
  Checkbox,
  DateInput,
  Fields,
  Field,
  Input,
  Textarea,
  Typography,
  UserPicker,
  validate,
  Loader,
} from 'nhh-styles';

class AddTaskForm extends PureComponent {
  static propTypes = {
    addTask: PropTypes.shape({
      addTask: PropTypes.string.isRequired,
      addTaskButton: PropTypes.string.isRequired,
      assignToMeLabel: PropTypes.string.isRequired,
      backButton: PropTypes.string.isRequired,
      dateErrorText: PropTypes.string.isRequired,
      dateLabel: PropTypes.string.isRequired,
      descriptionErrorText: PropTypes.string.isRequired,
      descriptionLabel: PropTypes.string.isRequired,
      submitButton: PropTypes.string.isRequired,
      titleErrorText: PropTypes.string.isRequired,
      titleLabel: PropTypes.string.isRequired,
      userPickerLabel: PropTypes.string.isRequired,
      userPickerPlaceholder: PropTypes.string.isRequired,
    }).isRequired,
    clearUserSearch: PropTypes.func.isRequired,
    housingOfficerSearchResults: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    loggedInUserId: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
    onDisplayFormError: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    userFullName: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.search = debounce(props.onSearch, 500);
  }

  state = {
    title: '',
    description: '',
    date: null,
    assignToMe: true,
    taskedAssignedTo: this.props.userFullName,
    ownerId: this.props.loggedInUserId,
  };

  onAssignTaskToMe = () => {
    const { clearUserSearch } = this.props;
    const newAssignedToMe = !this.state.assignToMe;
    this.setState({ assignToMe: newAssignedToMe });
    if (newAssignedToMe) {
      this.resetAssigneeBackToMe(clearUserSearch);
    }
  };

  resetAssigneeBackToMe = callback => {
    this.setState(
      {
        taskedAssignedTo: this.props.userFullName,
        ownerId: this.props.loggedInUserId,
      },
      callback || null
    );
  };

  isThisUserSelected = user => user.id === this.state.ownerId;

  handleSubmit = e => {
    e.preventDefault();

    const { title, description, date } = this.state;
    const {
      addTask: { titleErrorText, descriptionErrorText, dateErrorText },
      onSubmit,
    } = this.props;

    const validationTitle = validate(title, {
      errors: { default: titleErrorText },
    });

    const validationDescription = validate(description, {
      errors: { default: descriptionErrorText },
    });

    const validationDate = validate(date, {
      errors: { default: dateErrorText },
    });

    if (
      validationTitle.didValidate &&
      validationDescription.didValidate &&
      validationDate.didValidate
    ) {
      onSubmit(this.state);
    } else {
      this.props.onDisplayFormError();
    }
    this.setState({
      titleError: validationTitle.message,
      descriptionError: validationDescription.message,
      dateError: validationDate.message,
    });
  };

  resetError = val => {
    this.setState({ [val]: null });
  };

  updateInputState = dataSetStateKey => ({ target: { value } }) => {
    const error = `${dataSetStateKey}Error`;
    this.setState({ [dataSetStateKey]: value }, this.resetError(error));
  };

  userSelected = ({ fullName, id }) => {
    if (id === this.state.ownerId) {
      // assign back to me if the selected user is selected again
      this.resetAssigneeBackToMe();
    } else {
      this.setState({
        taskedAssignedTo: fullName,
        ownerId: id,
      });
    }
  };

  render() {
    const {
      addTask: {
        backButton,
        titleLabel,
        descriptionLabel,
        dateLabel,
        assignToMeLabel,
        submitButton,
        userPickerLabel,
        userPickerPlaceholder,
      },
      loading,
      housingOfficerSearchResults,
      onBack,
    } = this.props;
    const { title, description, titleError, descriptionError, dateError } = this.state;

    return (
      <form data-bdd="addTaskForm" onSubmit={this.handleSubmit}>
        <Fields>
          <Field>
            <Input
              disabled={loading}
              data-bdd="addTaskForm-title"
              data-state-key="title"
              error={titleError}
              id="title"
              isFullWidth
              labelText={titleLabel}
              onChange={this.updateInputState('title')}
              required
              value={title}
            />
          </Field>
          <Field>
            <Textarea
              disabled={loading}
              data-bdd="addTaskForm-description"
              error={descriptionError}
              id="description"
              isFullWidth
              labelText={descriptionLabel}
              onChange={this.updateInputState('description')}
              required
              value={description}
            />
          </Field>
          <Field data-bdd={'addTaskForm-date-parent'}>
            <DateInput
              disabled={loading}
              data-bdd="addTaskForm-date"
              labelText={dateLabel}
              required
              onDateSelected={date => this.setState({ date }, this.resetError('dateError'))}
              error={dateError}
            />
          </Field>
          <Field>
            <Typography.Label>
              Task Assigned to: <Typography.RequiredAsterisk> * </Typography.RequiredAsterisk>
              {this.state.taskedAssignedTo}
            </Typography.Label>
          </Field>
          <Field>
            <Checkbox
              data-bdd="addTaskForm-assignToMe"
              checked={this.state.assignToMe}
              onChange={this.onAssignTaskToMe}
              disabled={loading}
            >
              {assignToMeLabel}
            </Checkbox>
          </Field>
          {!this.state.assignToMe && (
            <Field>
              <UserPicker
                isLoading={loading}
                data-bdd="addTaskForm-userPicker"
                onSearch={this.search}
                searchResultsMemberResults={housingOfficerSearchResults}
                isPrimaryButtonType={this.isThisUserSelected}
                onUserSelected={this.userSelected}
                isUserDisabled={() => {}}
                placeHolderText={userPickerPlaceholder}
                labelText={userPickerLabel}
              />
            </Field>
          )}
        </Fields>
        {loading ? (
          <Loader />
        ) : (
          <ActionButtonsWrapper>
            <Button
              buttonType="secondary"
              data-bdd="addTaskForm-cancel"
              isFullWidth
              onClick={onBack}
              type="button"
              disabled={loading}
            >
              {backButton}
            </Button>
            <Button data-bdd="addTaskForm-submit" isFullWidth disabled={loading}>
              {submitButton}
            </Button>
          </ActionButtonsWrapper>
        )}
      </form>
    );
  }
}

export default AddTaskForm;
