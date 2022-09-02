import {
  Button,
  InputLabel,
  NotificationPanel,
  validate,
  UserPicker,
  Input,
  Loader,
} from 'nhh-styles';
import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import any from 'ramda/src/any';
import equals from 'ramda/src/equals';
import compose from 'ramda/src/compose';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import values from 'ramda/src/values';

import connect from './connect';
import {
  ButtonRow,
  ModalFieldRow,
  NotificationWrapper,
  TaskTitle,
  TemplateContainer,
} from '../../components';

const dataBdd = 'TaskReassign';

const initialState = {
  errors: {
    assignee: null,
  },
  reason: '',
};

export class TaskReassignModalComposition extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.search = debounce(props.onUserSearch, 500);
  }

  state = {
    taskedAssignedTo: '',
    ownerId: '',
  };

  componentWillUnmount() {
    this.props.onUnmount();
  }
  handleInputChange = (fieldName, value) => {
    this.setState(
      {
        [fieldName]: value,
      },
      this.resetError('reason')
    );
  };

  handleSubmit = eve => {
    eve.preventDefault();
    const validation = this.validate();
    if (validation.isValid) {
      this.props.onSubmit({
        ownerId: this.state.ownerId,
        taskedAssignedTo: this.state.taskedAssignedTo,
        reason: this.state.reason,
      });
    } else {
      this.setState({
        errors: {
          assignee: path(['errors', 'assignee', 'message'], validation),
          reason: path(['errors', 'reason', 'message'], validation),
        },
      });
    }
  };

  resetError = val => {
    this.setState({ errors: { ...this.state.errors, [val]: null } });
  };

  validate = () => {
    const { errorText } = this.props;
    const validations = {};
    validations.assignee = validate(this.state.ownerId, {
      errors: { default: errorText.assignee },
    });
    validations.reason = validate(this.state.reason, {
      errors: { default: errorText.reason },
    });

    const validationFailed = compose(equals(false), prop('didValidate'));

    const anyValidationsFailed = any(validationFailed)(values(validations));

    return {
      errors: validations,
      isValid: !anyValidationsFailed,
    };
  };

  isThisUserSelected = user => user.id === this.state.ownerId;

  userSelected = ({ fullName, id }) => {
    if (id === this.state.ownerId) {
      this.setState({
        taskedAssignedTo: '',
        ownerId: '',
      });
    } else {
      this.setState(
        {
          taskedAssignedTo: fullName,
          ownerId: id,
        },
        this.resetError('assignee')
      );
    }
  };

  render() {
    const {
      serverError,
      labels: { cancelButton, userPickerLabel, userPickerPlaceholder, reason },
      onCancel,
      searchResults,
      taskReassign,
      isLoading,
    } = this.props;
    const {
      errors: { assignee: assigneeError, reason: reasonError },
    } = this.state;
    return (
      <TemplateContainer>
        <TaskTitle>{taskReassign}</TaskTitle>
        <form onSubmit={this.handleSubmit}>
          {!!serverError && (
            <NotificationWrapper data-bdd={`${dataBdd}-error`}>
              <NotificationPanel icon="warning" description={serverError} hideCloseButton show />
            </NotificationWrapper>
          )}
          <ModalFieldRow>
            <InputLabel key="label" htmlFor="assignee" showLabel required>
              Reassign to
            </InputLabel>
            <UserPicker
              isLoading={isLoading}
              error={assigneeError}
              data-bdd={`${dataBdd}-assignee`}
              data-state-key="assignee"
              onSearch={this.search}
              searchResultsMemberResults={searchResults}
              isPrimaryButtonType={this.isThisUserSelected}
              onUserSelected={this.userSelected}
              isUserDisabled={() => {}}
              placeHolderText={userPickerPlaceholder}
              labelText={userPickerLabel}
            />
          </ModalFieldRow>
          <ModalFieldRow>
            <Input
              disabled={isLoading}
              data-bdd={`${dataBdd}-reason`}
              data-state-key="reason"
              id="reason"
              required
              labelText={reason}
              isFullWidth
              value={this.state.reason}
              onChange={e => this.handleInputChange('reason', e.target.value)}
              error={reasonError}
            />
          </ModalFieldRow>
          {isLoading ? (
            <Loader />
          ) : (
            <ButtonRow>
              <Button
                isFullWidth
                buttonType="secondary"
                data-bdd={`${dataBdd}-cancel`}
                type="button"
                onClick={onCancel}
              >
                {cancelButton}
              </Button>
              <Button isFullWidth data-bdd={`${dataBdd}-submit`} onClick={this.handleSubmit}>
                {taskReassign}
              </Button>
            </ButtonRow>
          )}
        </form>
      </TemplateContainer>
    );
  }
}

TaskReassignModalComposition.defaultProps = {
  serverError: '',
};

TaskReassignModalComposition.propTypes = {
  errorText: PropTypes.shape({
    assignee: PropTypes.string.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  labels: PropTypes.shape({
    cancelButton: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    userPickerLabel: PropTypes.string.isRequired,
    userPickerPlaceholder: PropTypes.string.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
  onUserSearch: PropTypes.func.isRequired,
  searchResults: PropTypes.array.isRequired,
  taskReassign: PropTypes.string.isRequired,
  serverError: PropTypes.string,
};

export default connect(TaskReassignModalComposition);
