import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  CharacterCountTextbox,
  ActionButtonsWrapper,
  Button,
  NotificationPanel,
  Typography,
  Checkbox,
  Loader,
} from 'nhh-styles';

import { PageContent, PropertyInformation } from '../';
import { NotificationWrapper } from '../../components/Common';

import { CustomerDetailsContainer, FormContainer, Link, Wrapper } from './components';
import connect from './connect';

export class AddNoteComposition extends PureComponent {
  state = {
    wantsToAttachFiles: false,
    fieldName: '',
    maximumCharacterLength: 2000,
    warningMessage:
      'You cannot exceed 2000 characters for a note.  Try attaching your text as a separate document or reduce the character count.',
    note: '',
    errors: {},
    hideAddNote: true,
  };

  componentDidMount() {
    const { updatePageHeader } = this.props;
    updatePageHeader();
  }

  componentWillUnmount() {
    const { clearError } = this.props;
    clearError();
  }

  onSubmit = note => {
    const { wantsToAttachFiles } = this.state;
    this.props.onSubmit(note, wantsToAttachFiles);
  };

  onAttachFiles = () =>
    this.setState({
      wantsToAttachFiles: !this.state.wantsToAttachFiles,
    });

  handleAddNote = () => {
    const { note, wantsToAttachFiles } = this.state;
    this.onSubmit(note, wantsToAttachFiles);
  };

  handleInputChange = (fieldName, value) => {
    if (value.length === 0) {
      this.setState({ hideAddNote: true });
    }
    if (value.length > 0) {
      this.setState({ hideAddNote: false });
    }
    this.setState({ fieldName, note: value });
  };

  render() {
    const {
      addInteraction,
      arrearsId,
      attachFile,
      error,
      formError,
      onBack,
      warning,
      isLoading,
    } = this.props;

    const { wantsToAttachFiles, maximumCharacterLength, warningMessage, hideAddNote } = this.state;

    const attachFiles = (
      <Checkbox
        data-bdd="addNoteForm-attachFiles"
        data-state-key={'attachFiles'}
        onChange={this.onAttachFiles}
        checked={wantsToAttachFiles}
      >
        {attachFile}
      </Checkbox>
    );

    if (isLoading) {
      return <Loader />;
    }

    return (
      <PageContent>
        <div className="col-lg-9">
          <Wrapper>
            <CustomerDetailsContainer>
              <PropertyInformation />
            </CustomerDetailsContainer>
            <FormContainer>
              <Typography.P>
                {warning}
                &nbsp;
                <Link
                  data-bdd="AddInteraction-link"
                  to={`/arrears-details/${arrearsId}/interaction/create`}
                  isText
                >
                  {addInteraction}
                </Link>
              </Typography.P>

              {!!error && (
                <NotificationWrapper data-bdd="AddNote-error">
                  <NotificationPanel icon="warning" description={formError} hideCloseButton show />
                </NotificationWrapper>
              )}

              <CharacterCountTextbox
                data-state-key="CharacterCountTextbox"
                id="CharacterCountTextbox"
                labelText="Note"
                maxLength={maximumCharacterLength}
                charactersLimitReachedMessage={warningMessage}
                onChange={this.handleInputChange}
                isFullWidth
                name="CountTextbox"
                required
              />
              {attachFiles}
              <ActionButtonsWrapper>
                <Button
                  buttonType="secondary"
                  data-bdd="CharacterCountTextbox-back"
                  isFullWidth
                  onClick={onBack}
                  type="button"
                >
                  Back
                </Button>
                <Button
                  data-bdd="CharacterCountTextbox-submit"
                  onClick={this.handleAddNote}
                  disabled={hideAddNote}
                  isFullWidth
                >
                  Add note
                </Button>
              </ActionButtonsWrapper>
            </FormContainer>
          </Wrapper>
        </div>
      </PageContent>
    );
  }
}

AddNoteComposition.defaultProps = {
  error: false,
};

AddNoteComposition.propTypes = {
  addInteraction: PropTypes.string.isRequired,
  arrearsId: PropTypes.string.isRequired,
  attachFile: PropTypes.string.isRequired,
  clearError: PropTypes.func.isRequired,
  formError: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  warning: PropTypes.string.isRequired,
  error: PropTypes.bool,
};

export default connect(AddNoteComposition);
