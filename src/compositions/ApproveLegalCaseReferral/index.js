import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import {
  Loader,
  NotificationPanel,
  PaddedBox,
  Radio,
  RadioGroup,
  Textarea,
  Typography,
  validate,
} from 'nhh-styles';

import { FieldRow, FormWrapper } from '../../components';
import { Link, NotificationWrapper } from './components';
import { PageContent } from '../';
import connect from './connect';

const initialState = {
  approveReferral: null,
  errors: {},
  isDirty: {},
  reasonForDenying: '',
  hasClickedReferralForm: false,
  hasClickedReferralPack: false,
};

export class ApproveLegalCaseReferralComposition extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { ...initialState, formError: props.formError };
  }

  componentDidMount() {
    const { getLegalReferral, updatePageHeader } = this.props;
    updatePageHeader();
    getLegalReferral();
  }

  handleAssetClick = itemName => {
    this.setState({ [itemName]: true });
  };

  handleBackClick = () => {
    this.resetForm();
    this.props.onBack();
  };

  handleLegalReferralFormLink = (e, link) => {
    e.preventDefault();
    this.props.downloadFile(link, 'LegalReferralForm.pdf');
    this.handleAssetClick('hasClickedReferralForm');
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
    const { approveReferral, isDirty, reasonForDenying } = this.state;
    const {
      errorText: { approveReferralError, reasonForDenyingError },
    } = this.props;

    const isDenied = approveReferral === 'no';

    const approvalValidation = validate(approveReferral, {
      errors: { default: approveReferralError },
    });

    const reasonValidation = validate(reasonForDenying, {
      errors: { default: reasonForDenyingError },
    });

    this.setState({
      errors: {
        approveReferral: approvalValidation.message,
        reasonForDenying: isDirty.reasonForDenying && isDenied ? reasonValidation.message : '',
      },
    });

    return approvalValidation.didValidate && !(isDenied && !reasonValidation.didValidate);
  };

  render() {
    const {
      referralPack: { legalReferralForm, legalReferralPack },
      errorText: { formError: formErrorMessage },
      formError,
      heading,
      labels: {
        approveReferral: approveReferralLabel,
        approveReferralSubtitle,
        backButton,
        no,
        reasonForDenying: reasonForDenyingLabel,
        referralFormLink,
        referralPackLink,
        submitButton,
        yes,
      },
      loading,
      requiresNonCreatorApproval,
      showReadOnlyView,
      showReadOnlyViewNotification,
      subtitle,
    } = this.props;

    const {
      approveReferral,
      reasonForDenying,
      errors,
      hasClickedReferralForm,
      hasClickedReferralPack,
    } = this.state;

    const disableForm = !hasClickedReferralForm || !hasClickedReferralPack;

    const documents = (
      <div>
        <Typography.H2>{heading}</Typography.H2>
        <Typography.P>{subtitle}</Typography.P>
        <FieldRow>
          <Link
            data-bdd="approveReferral-legalReferralForm-link"
            onClick={e => this.handleLegalReferralFormLink(e, legalReferralForm.link)}
            isText
          >
            {referralFormLink}
          </Link>
          <Link
            data-bdd="approveReferral-legalReferralPack-link"
            href={legalReferralPack.link}
            onClick={() => this.handleAssetClick('hasClickedReferralPack')}
            target="_blank"
            isText
          >
            {referralPackLink}
          </Link>
        </FieldRow>
      </div>
    );

    const loadingView = () => (
      <PageContent>
        <Loader />
      </PageContent>
    );

    const readOnlyView = () => (
      <PageContent>
        <div className="col-lg-9" data-bdd="approveReferral-readOnlyView">
          {showReadOnlyViewNotification && (
            <NotificationWrapper>
              <NotificationPanel
                description={requiresNonCreatorApproval}
                hideCloseButton
                icon="warning"
                show
              />
            </NotificationWrapper>
          )}
          <PaddedBox>{documents}</PaddedBox>
        </div>
      </PageContent>
    );

    if (loading) return loadingView();
    if (showReadOnlyView) return readOnlyView();
    return (
      <PageContent>
        <div className="col-lg-9">
          <FormWrapper
            backButtonText={backButton}
            disableSubmit={disableForm}
            formError={formError ? formErrorMessage : ''}
            formName="approveReferral"
            handleBackClick={this.handleBackClick}
            handleFormSubmit={this.handleFormSubmit}
            hidePropertyInformation
            submitButtonText={submitButton}
          >
            {documents}
            <div>
              <Typography.Label data-bdd="approveReferral-radioGroup-label">
                {approveReferralLabel}
              </Typography.Label>
              <Typography.P>
                <span data-bdd="approveReferral-radioGroup-sublabel">
                  {approveReferralSubtitle}
                </span>
              </Typography.P>
            </div>
            <FieldRow>
              <RadioGroup error={errors.approveReferral} required>
                <Radio
                  checked={approveReferral === 'yes'}
                  data-bdd="approveReferral-radioGroup-yes"
                  disabled={disableForm}
                  display="block"
                  id="yes"
                  name="approveReferralGroup"
                  onChange={() => this.handleFieldChange('approveReferral', 'yes')}
                >
                  {yes}
                </Radio>
                <Radio
                  checked={approveReferral === 'no'}
                  data-bdd="approveReferral-radioGroup-no"
                  disabled={disableForm}
                  display="block"
                  id="no"
                  name="approveReferralGroup"
                  onChange={() => this.handleFieldChange('approveReferral', 'no')}
                >
                  {no}
                </Radio>
              </RadioGroup>
            </FieldRow>
            {approveReferral === 'no' && (
              <FieldRow>
                <Textarea
                  data-bdd="approveReferral-reasonForDenying"
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
      </PageContent>
    );
  }
}

ApproveLegalCaseReferralComposition.defaultProps = {
  formError: false,
  loading: false,
  referralPack: {
    legalReferralForm: {},
    legalReferralPack: {},
  },
  showReadOnlyView: false,
  showReadOnlyViewNotification: false,
};

const packProps = {
  link: PropTypes.string,
  status: PropTypes.string,
};

ApproveLegalCaseReferralComposition.propTypes = {
  downloadFile: PropTypes.func.isRequired,
  errorText: PropTypes.shape({
    approveReferralError: PropTypes.string.isRequired,
    formError: PropTypes.string.isRequired,
    reasonForDenyingError: PropTypes.string.isRequired,
  }).isRequired,
  getLegalReferral: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  labels: PropTypes.shape({
    approveReferral: PropTypes.string.isRequired,
    approveReferralSubtitle: PropTypes.string.isRequired,
    backButton: PropTypes.string.isRequired,
    no: PropTypes.string.isRequired,
    reasonForDenying: PropTypes.string.isRequired,
    referralFormLink: PropTypes.string.isRequired,
    referralPackLink: PropTypes.string.isRequired,
    submitButton: PropTypes.string.isRequired,
    yes: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  requiresNonCreatorApproval: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  formError: PropTypes.bool,
  loading: PropTypes.bool,
  referralPack: PropTypes.shape({
    legalReferralForm: PropTypes.shape(packProps).isRequired,
    legalReferralPack: PropTypes.shape(packProps).isRequired,
  }),
  showReadOnlyView: PropTypes.bool,
  showReadOnlyViewNotification: PropTypes.bool,
};

export default withRouter(connect(ApproveLegalCaseReferralComposition));
