import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ActionButtonsWrapper, Button, Loader, NotificationPanel, PaddedBox } from 'nhh-styles';
import { PageContent } from '../';
import { Section, SectionTitle, TextBlock } from './components';
import { Heading, NotificationWrapper } from '../../components/Common';
import connect from './connect';

const dataBddPrefix = 'viewPaymentPlan';

export class ViewPaymentPlanCompositions extends PureComponent {
  componentDidMount() {
    const { getPaymentPlan, updatePageHeader } = this.props;
    getPaymentPlan();
    updatePageHeader();
  }

  componentWillUnmount() {
    const { clearError } = this.props;
    clearError();
  }

  render() {
    const { error, labels, loading, onBack, onClose, paymentPlan } = this.props;
    const { description, endDate, installment, raisedBy, startDate, type } = paymentPlan;
    const {
      backButton,
      closeButton,
      endDate: endDateLabel,
      installment: installmentLabel,
      note,
      paymentPlanType: paymentPlanTypeLabel,
      raisedBy: raisedByLabel,
      startDate: startDateLabel,
    } = labels;

    const { closePlan: closePlanError } = this.props.errorText;

    return (
      <PageContent>
        {loading ? (
          <Loader />
        ) : (
          <div className="col-lg-9">
            <PaddedBox>
              {!!error && (
                <NotificationWrapper data-bdd={`${dataBddPrefix}-error`}>
                  <NotificationPanel
                    icon="warning"
                    description={closePlanError}
                    hideCloseButton
                    show
                  />
                </NotificationWrapper>
              )}
              <Heading>View payment plan</Heading>
              {!!type && (
                <Section>
                  <SectionTitle>{paymentPlanTypeLabel}</SectionTitle>
                  <TextBlock data-bdd={`${dataBddPrefix}-type`}>{type}</TextBlock>
                </Section>
              )}
              {!!installment && (
                <Section>
                  <SectionTitle>{installmentLabel}</SectionTitle>
                  <TextBlock data-bdd={`${dataBddPrefix}-installment`}>{installment}</TextBlock>
                </Section>
              )}
              {!!startDate && (
                <Section>
                  <SectionTitle>{startDateLabel}</SectionTitle>
                  <TextBlock data-bdd={`${dataBddPrefix}-startDate`}>{startDate}</TextBlock>
                </Section>
              )}
              {!!endDate && (
                <Section>
                  <SectionTitle>{endDateLabel}</SectionTitle>
                  <TextBlock data-bdd={`${dataBddPrefix}-endDate`}>{endDate}</TextBlock>
                </Section>
              )}
              {!!raisedBy && (
                <Section>
                  <SectionTitle>{raisedByLabel}</SectionTitle>
                  <TextBlock data-bdd={`${dataBddPrefix}-raisedBy`}>{raisedBy}</TextBlock>
                </Section>
              )}
              {!!description && (
                <Section>
                  <SectionTitle>{note}</SectionTitle>
                  <TextBlock data-bdd={`${dataBddPrefix}-description`}>{description}</TextBlock>
                </Section>
              )}
              <ActionButtonsWrapper>
                <Button
                  buttonType="secondary"
                  data-bdd={`${dataBddPrefix}-back`}
                  onClick={onBack}
                  isFullWidth
                >
                  {backButton}
                </Button>
                <Button data-bdd={`${dataBddPrefix}-close`} onClick={onClose} isFullWidth>
                  {closeButton}
                </Button>
              </ActionButtonsWrapper>
            </PaddedBox>
          </div>
        )}
      </PageContent>
    );
  }
}

ViewPaymentPlanCompositions.defaultProps = {
  loading: false,
  paymentPlan: null,
};

ViewPaymentPlanCompositions.propTypes = {
  clearError: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  errorText: PropTypes.shape({
    closePlan: PropTypes.string.isRequired,
  }).isRequired,
  getPaymentPlan: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    backButton: PropTypes.string.isRequired,
    closeButton: PropTypes.string.isRequired,
    installment: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  paymentPlan: PropTypes.shape({
    description: PropTypes.string,
    endDate: PropTypes.string,
    installment: PropTypes.string,
    raisedBy: PropTypes.string,
    startDate: PropTypes.string,
    type: PropTypes.string,
  }),
};

export default connect(ViewPaymentPlanCompositions);
