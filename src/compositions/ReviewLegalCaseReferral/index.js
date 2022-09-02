import React, { Component } from 'react';
import PropTypes from 'prop-types';
import format from 'string-format';
import path from 'ramda/src/path';
import { AsyncAssetLink, Checkbox, Typography, Loader } from 'nhh-styles';

import { FormWrapper } from '../../components';
import { PageContent } from '../';
import { LRF_STATUS } from '../../constants/legalReferral';

import { Row } from './components';
import connect from './connect';

export class ReviewLegalCaseReferralComposition extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      hasClickedReferralForm: false,
      hasClickedReferralPack: false,
      isFormSubmitting: false,
      isFormCancelling: false,
    };
    props.invalidateLegalReferralState();
  }

  componentDidMount() {
    const { getLegalReferral, updatePageHeader } = this.props;
    updatePageHeader();
    getLegalReferral();
    this.tries = 0;
    this.interval = setInterval(this.getDetails, 5000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { referralPack: newReferralPack, requiresApproval: newRequiresApproval } = nextProps;

    const { referralPack, requiresApproval } = this.props;

    const lrfLink = path(['legalReferralForm', 'link'], referralPack);
    const lrpLink = path(['legalReferralPack', 'link'], referralPack);
    const newLrfLink = path(['legalReferralForm', 'link'], newReferralPack);
    const newLrpLink = path(['legalReferralPack', 'link'], newReferralPack);

    return (
      lrfLink !== newLrfLink ||
      lrpLink !== newLrpLink ||
      this.state !== nextState ||
      requiresApproval !== newRequiresApproval
    );
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  onSubmit = () => {
    this.setState({ isFormSubmitting: true });
    this.props.onSubmit();
  };

  getDetails = () => {
    const { errorStatus, getLegalReferral, referralPack } = this.props;
    const lrfLink = path(['legalReferralForm', 'link'], referralPack);
    const lrpLink = path(['legalReferralPack', 'link'], referralPack);
    const lrpStatus = path(['legalReferralPack', 'status'], referralPack);
    const isFailedFatal = lrpStatus === LRF_STATUS.FAILED_FATAL;
    const isNotReadyYet = errorStatus === 404 || errorStatus === 500;
    if ((lrfLink && lrpLink) || (isNotReadyYet && this.tries > 5) || isFailedFatal) {
      this.clearInterval();
      if (isFailedFatal) {
        this.setState({});
      }
      if (errorStatus) {
        this.setState({ error: true });
      }
    } else {
      this.tries += 1;
      getLegalReferral();
    }
  };

  clearInterval() {
    clearInterval(this.interval);
    this.interval = undefined;
  }

  handleCheckbox = isChecked => {
    this.setState({ isChecked });
  };

  handleAssetClick = itemName => {
    this.setState({ [itemName]: true });
  };

  handleLegalReferralFormLink = (e, link) => {
    e.preventDefault();
    this.props.downloadFile(link, 'LegalReferralForm.pdf');
    this.handleAssetClick('hasClickedReferralForm');
  };

  handleCancel = () => {
    this.clearInterval();
    this.setState({ isFormCancelling: true });
    this.props.onCancel({
      noteText: 'Original requester cancelled',
    });
  };

  render() {
    const {
      error,
      isChecked,
      isFormSubmitting,
      hasClickedReferralForm,
      hasClickedReferralPack,
      isFormCancelling,
    } = this.state;
    const { formError, referralPack, requiresApproval, text } = this.props;
    const {
      cancel,
      generatingItem,
      generationFailed,
      legalReferralForm: legalReferralFormStr,
      legalReferralFormText,
      legalReferralPack: legalReferralPackStr,
      legalReferralPackConfirm,
      legalReferralPackConfirmMessage,
      linkToSharepoint,
      pdf,
      reviewLegalCase,
      reviewText,
      submit,
      submitForReview,
    } = text;

    const lrf = path(['legalReferralForm'], referralPack);
    const lrp = path(['legalReferralPack'], referralPack);

    const legalReferralForm = format(legalReferralFormStr, {});
    const legalReferralPack = format(legalReferralPackStr, {});

    const legalReferralFormError =
      lrf.status === LRF_STATUS.FAILED_RETRIABLE || lrf.status === LRF_STATUS.FAILED_FATAL;

    const legalReferralFormLoaded = lrf.status === LRF_STATUS.SUCCESS;

    const legalReferralPackError =
      lrp.status === LRF_STATUS.FAILED_RETRIABLE || lrp.status === LRF_STATUS.FAILED_FATAL;

    const legalReferralPackLoaded = lrp.status === LRF_STATUS.SUCCESS;

    const disableCheckbox = !hasClickedReferralForm || !hasClickedReferralPack;
    const disableFormSubmit = !isChecked || disableCheckbox || isFormSubmitting;

    const isGenerationFormGoing = !legalReferralFormLoaded && !legalReferralFormError;
    const isGenerationPackGoing = !legalReferralPackLoaded && !legalReferralPackError;

    return (
      <PageContent>
        {isFormCancelling ? (
          <Loader />
        ) : (
          <div className="col-lg-9">
            <FormWrapper
              backButtonText={cancel}
              disableSubmit={disableFormSubmit}
              disableBack={isFormCancelling}
              formError={error && formError}
              formName="reviewLegalCaseReferral"
              handleBackClick={this.handleCancel}
              handleFormSubmit={this.onSubmit}
              hidePropertyInformation
              submitButtonText={requiresApproval ? submitForReview : submit}
            >
              {!error && (
                <div>
                  <Typography.H2>{reviewLegalCase}</Typography.H2>

                  <Typography.P>{reviewText}</Typography.P>

                  <Row>
                    <Typography.H4>{legalReferralForm}</Typography.H4>
                    <AsyncAssetLink
                      dataBdd="legalReferralForm"
                      failed={legalReferralFormError ? generationFailed : undefined}
                      href={lrf.link}
                      loading={isGenerationFormGoing}
                      loadingText={format(generatingItem, { item: legalReferralForm })}
                      name={format(legalReferralFormStr, { type: pdf })}
                      onClick={e => this.handleLegalReferralFormLink(e, lrf.link)}
                      target="_blank"
                    />
                    <Typography.P>{legalReferralFormText}</Typography.P>
                  </Row>

                  <Row>
                    <Typography.H4>{format(legalReferralPack, {})}</Typography.H4>
                    <AsyncAssetLink
                      dataBdd="legalReferralPack"
                      failed={legalReferralPackError ? generationFailed : undefined}
                      href={lrp.link}
                      loading={isGenerationPackGoing}
                      loadingText={format(generatingItem, { item: legalReferralPack })}
                      name={format(legalReferralPackStr, { type: linkToSharepoint })}
                      onClick={() => this.handleAssetClick('hasClickedReferralPack')}
                      target="_blank"
                    />
                  </Row>

                  {!!lrf.link && !!lrp.link && !legalReferralFormError && !legalReferralPackError && (
                    <div>
                      <Row>
                        <Checkbox
                          disabled={disableCheckbox}
                          checked={isChecked}
                          data-bdd="pauseArrearsCase-notifyManager"
                          onChange={() => this.handleCheckbox(!isChecked)}
                          required
                        >
                          {legalReferralPackConfirm}
                        </Checkbox>
                      </Row>

                      <Row>
                        <Typography.P>{legalReferralPackConfirmMessage}</Typography.P>
                      </Row>
                    </div>
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

ReviewLegalCaseReferralComposition.defaultProps = {
  errorStatus: undefined,
  referralPack: {
    legalReferralForm: {},
    legalReferralPack: {},
  },
  requiresApproval: true,
};

const packProps = {
  link: PropTypes.string,
  status: PropTypes.string,
};

ReviewLegalCaseReferralComposition.propTypes = {
  downloadFile: PropTypes.func.isRequired,
  formError: PropTypes.string.isRequired,
  getLegalReferral: PropTypes.func.isRequired,
  invalidateLegalReferralState: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  text: PropTypes.shape({
    cancel: PropTypes.string.isRequired,
    generatingItem: PropTypes.string.isRequired,
    generationFailed: PropTypes.string.isRequired,
    legalReferralFormText: PropTypes.string.isRequired,
    legalReferralPackConfirm: PropTypes.string.isRequired,
    legalReferralPackConfirmMessage: PropTypes.string.isRequired,
    linkToSharepoint: PropTypes.string.isRequired,
    pdf: PropTypes.string.isRequired,
    reviewLegalCase: PropTypes.string.isRequired,
    reviewText: PropTypes.string.isRequired,
    submit: PropTypes.string.isRequired,
    submitForReview: PropTypes.string.isRequired,
  }).isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  errorStatus: PropTypes.number,
  referralPack: PropTypes.shape({
    legalReferralForm: PropTypes.shape(packProps).isRequired,
    legalReferralPack: PropTypes.shape(packProps).isRequired,
  }),
  requiresApproval: PropTypes.bool,
};

export default connect(ReviewLegalCaseReferralComposition);
