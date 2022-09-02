import { Button, NotificationPanel, Loader } from 'nhh-styles';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';
import connect from './connect';
import { Title } from './components';
import { ButtonRow, NotificationWrapper } from '../../components';

const dataBddPrefix = 'serveNOSPEarly';

export const ServeNOSPEarly = ({ error, errorMessage, labels, onCancel, onSubmit, isLoading }) => {
  const { cancel, title, submit } = labels;
  return (
    <div data-bdd={`${dataBddPrefix}-template`}>
      {!!error && (
        <NotificationWrapper data-bdd="AddNote-error">
          <NotificationPanel
            icon="warning"
            description={errorMessage}
            hideCloseButton
            show
            title="error"
          />
        </NotificationWrapper>
      )}
      <Title>{title}</Title>
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <ButtonRow>
            <Button
              isFullWidth
              buttonType="secondary"
              data-bdd={`${dataBddPrefix}-cancel`}
              type="button"
              onClick={onCancel}
            >
              {cancel}
            </Button>
            <Button isFullWidth data-bdd={`${dataBddPrefix}-submit`}>
              {submit}
            </Button>
          </ButtonRow>
        )}
      </form>
    </div>
  );
};

ServeNOSPEarly.defaultProps = {
  error: false,
};

ServeNOSPEarly.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  labels: PropTypes.shape({
    cancel: PropTypes.string.isRequired,
    submit: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.bool,
};

export default withRouter(connect(ServeNOSPEarly));
