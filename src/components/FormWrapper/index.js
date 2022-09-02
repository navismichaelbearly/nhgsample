import React from 'react';
import PropTypes from 'prop-types';
import {
  ActionButtonsWrapper,
  BoxHighlight,
  Button,
  NotificationPanel,
  PaddedBox,
  Loader,
} from 'nhh-styles';

import { PropertyInformation } from '../../compositions';
import { NotificationWrapper } from '../Common';

const FormWrapper = ({
  backButtonText,
  children,
  disablePropertyInformationEditMode,
  disableSubmit,
  disableBack,
  formError,
  formName,
  handleBackClick,
  handleFormSubmit,
  hidePropertyInformation,
  otherActions,
  otherActionsLeft,
  submitButtonText,
  loading,
}) => (
  <PaddedBox>
    {!hidePropertyInformation && (
      <BoxHighlight>
        <PropertyInformation disableGlobalEdit={disablePropertyInformationEditMode} />
      </BoxHighlight>
    )}
    <form data-bdd={`${formName}-form`} onSubmit={e => e.preventDefault()}>
      {!!formError && (
        <NotificationWrapper data-bdd={`${formName}-error`}>
          <NotificationPanel icon="warning" description={formError} hideCloseButton show />
        </NotificationWrapper>
      )}
      {children}
      {loading ? (
        <Loader />
      ) : (
        <ActionButtonsWrapper>
          {otherActionsLeft}
          {!!handleBackClick && !!backButtonText && (
            <Button
              data-bdd={`${formName}-back`}
              buttonType="secondary"
              isFullWidth
              type="button"
              onClick={handleBackClick}
              disabled={disableBack}
            >
              {backButtonText}
            </Button>
          )}
          <Button
            data-bdd={`${formName}-submit`}
            onClick={handleFormSubmit}
            disabled={disableSubmit}
            isFullWidth
          >
            {submitButtonText}
          </Button>
          {otherActions}
        </ActionButtonsWrapper>
      )}
    </form>
  </PaddedBox>
);

FormWrapper.defaultProps = {
  backButtonText: null,
  disableBack: false,
  disablePropertyInformationEditMode: false,
  disableSubmit: false,
  formError: null,
  handleBackClick: null,
  hidePropertyInformation: false,
  loading: false,
  otherActions: null,
  otherActionsLeft: null,
};

FormWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  formName: PropTypes.string.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  backButtonText: PropTypes.string,
  disableBack: PropTypes.bool,
  disablePropertyInformationEditMode: PropTypes.bool,
  disableSubmit: PropTypes.bool,
  formError: PropTypes.string,
  handleBackClick: PropTypes.func,
  hidePropertyInformation: PropTypes.bool,
  loading: PropTypes.bool,
  otherActions: PropTypes.node,
  otherActionsLeft: PropTypes.node,
};

export default FormWrapper;
