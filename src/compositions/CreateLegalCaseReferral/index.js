import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Loader, NotificationPanel } from 'nhh-styles';
import formSdk from '../../util/formSdk';
import { NoTouching } from '../../components';

import { PageContent } from '../';
import connect from './connect';

export class CreateLegalCaseReferralComposition extends PureComponent {
  componentDidMount() {
    const { clearSubmissions, updatePageHeader } = this.props;
    clearSubmissions();
    updatePageHeader();
  }

  async componentDidUpdate() {
    const {
      arrearsId,
      createSubmission,
      generateNewSubmissionId,
      error,
      formProps,
      formRendered,
      loading,
      newLegalReferralId,
      referralFormName,
      setFormRendered,
      submissionId,
      systemUserId,
      lastSubmissionId,
    } = this.props;

    const haventSubmittedAFormBefore =
      !loading && !error && !lastSubmissionId && !submissionId && referralFormName;

    const haveAPreviousSubmission =
      !loading && !error && !submissionId && lastSubmissionId && referralFormName;

    if (haventSubmittedAFormBefore) {
      await createSubmission();
    } else if (haveAPreviousSubmission) {
      await generateNewSubmissionId(referralFormName, arrearsId);
    }

    if (submissionId && !formRendered) {
      formSdk.setFormProps(formProps);
      formSdk.mountToDomNode();
      await formSdk.displaySubmissionById(lastSubmissionId || submissionId);
      formSdk.overrideSubmissionId(submissionId);

      formSdk.setFormDataAtKey('legalCaseId', newLegalReferralId, 1, true);
      formSdk.setFormDataAtKey('arrearsCaseId', arrearsId, 1, true);
      formSdk.setFormDataAtKey('systemUserId', systemUserId, 1, true);
      setFormRendered();
    }
  }

  render() {
    const { error, formError, loading } = this.props;
    return (
      <PageContent>
        {loading && <Loader />}
        {error && <NotificationPanel icon="warning" description={formError} hideCloseButton show />}
        <div className="col-lg-9">
          <NoTouching>
            <div id="forms-sdk-container" />
          </NoTouching>
        </div>
      </PageContent>
    );
  }
}

CreateLegalCaseReferralComposition.defaultProps = {
  error: false,
  formRendered: false,
  loading: false,
  referralFormName: null,
  submissionId: null,
  lastSubmissionId: null,
};

CreateLegalCaseReferralComposition.propTypes = {
  arrearsId: PropTypes.string.isRequired,
  clearSubmissions: PropTypes.func.isRequired,
  createSubmission: PropTypes.func.isRequired,
  formError: PropTypes.string.isRequired,
  formProps: PropTypes.shape({
    buttonLabels: PropTypes.shape({
      cancel: PropTypes.string.isRequired,
      continue: PropTypes.string.isRequired,
      next: PropTypes.string.isRequired,
      previous: PropTypes.string.isRequired,
      submit: PropTypes.string.isRequired,
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSuccessfulSubmit: PropTypes.func.isRequired,
  }).isRequired,
  generateNewSubmissionId: PropTypes.func.isRequired,
  newLegalReferralId: PropTypes.string.isRequired,
  setFormRendered: PropTypes.func.isRequired,
  systemUserId: PropTypes.string.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  error: PropTypes.bool,
  formRendered: PropTypes.bool,
  lastSubmissionId: PropTypes.string,
  loading: PropTypes.bool,
  referralFormName: PropTypes.string,
  submissionId: PropTypes.string,
};

export default connect(CreateLegalCaseReferralComposition);
