import { Button, Input, NotificationPanel, validate, Loader } from 'nhh-styles';
import React, { PureComponent } from 'react';
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

const dataBdd = 'TaskCancel';

const initialState = {
  errors: {},
  reason: '',
};

export class TaskCancelModalComposition extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  componentWillUnmount() {
    this.props.onUnmount();
  }
  handleInputChange = (fieldName, value) => {
    this.setState(
      {
        [fieldName]: value,
      },
      this.resetError()
    );
  };

  handleSubmit = eve => {
    eve.preventDefault();
    const validation = this.validate();
    if (validation.isValid) {
      this.props.onSubmit({ reason: this.state.reason });
    } else {
      this.setState({
        errors: {
          reason: path(['errors', 'reason', 'message'], validation),
        },
      });
    }
  };

  resetError = () => {
    this.setState({ errors: {} });
  };

  validate = () => {
    const { errorText } = this.props;
    const validations = {};
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

  render() {
    const {
      serverError,
      labels: { cancelTaskAction, reason },
      onCancel,
      taskCancel,
      isLoading,
    } = this.props;
    const {
      errors: { reason: reasonError },
    } = this.state;

    return (
      <TemplateContainer>
        <TaskTitle>{taskCancel}</TaskTitle>
        <form onSubmit={this.handleSubmit}>
          {!!serverError && (
            <NotificationWrapper data-bdd={`${dataBdd}-error`}>
              <NotificationPanel icon="warning" description={serverError} hideCloseButton show />
            </NotificationWrapper>
          )}
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
                {cancelTaskAction}
              </Button>
              <Button isFullWidth data-bdd={`${dataBdd}-submit`} onClick={this.handleSubmit}>
                {taskCancel}
              </Button>
            </ButtonRow>
          )}
        </form>
      </TemplateContainer>
    );
  }
}

TaskCancelModalComposition.defaultProps = {
  serverError: '',
};

TaskCancelModalComposition.propTypes = {
  errorText: PropTypes.shape({
    reason: PropTypes.string.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  labels: PropTypes.shape({
    cancelTaskAction: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
  taskCancel: PropTypes.string.isRequired,
  serverError: PropTypes.string,
};

export default connect(TaskCancelModalComposition);
