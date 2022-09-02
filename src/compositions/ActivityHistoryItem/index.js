import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  ActionButtonsWrapper,
  Button,
  Loader,
  PaddedBox,
  Typography,
  Table,
  Pagination,
} from 'nhh-styles';
import { HistoryItem } from '../../components';
import { PageContent, PropertyInformation } from '../';
import AttachmentsTableFileName from '../../components/ShrinkableFileName';
import downloadFile from '../../util/downloadFile';

import {
  ActivityItemWrapper,
  CustomerDetailsContainer,
  LoaderContainer,
  Wrapper,
  AttachmentsWrapper,
  TableWrapper,
  ErrorMessage,
} from './components';
import connect from './connect';
import { activityHistoryTypes } from '../../constants/activityHistoryTypes';

export class ActivityHistoryItemComposition extends PureComponent {
  componentDidMount() {
    const { getActivityHistory, updatePageHeader } = this.props;
    this.props.invalidateActivityDetail();
    updatePageHeader();
    getActivityHistory();
  }

  componentDidUpdate(prevProps) {
    const {
      activityDetail,
      activityError,
      activityLoading,
      activities,
      getActivityById,
      itemId,
    } = this.props;
    const activityDetailNotLoadedOrErrored = !activityDetail && !activityLoading && !activityError;
    const historyItemNavigated = itemId !== prevProps.itemId;
    if (activities.length && itemId && (activityDetailNotLoadedOrErrored || historyItemNavigated)) {
      getActivityById(itemId);
    }
  }

  getLabels(type) {
    const {
      pauseLabels,
      referralLabels,
      paymentLabels,
      paymentPlanLabels,
      labels,
      legalReferralLabels,
    } = this.props;
    switch (type) {
      case activityHistoryTypes.PAUSE:
        return pauseLabels;
      case activityHistoryTypes.REFERRAL:
        return referralLabels;
      case activityHistoryTypes.PAYMENT:
        return paymentLabels;
      case activityHistoryTypes.PAYMENT_PLAN:
        return paymentPlanLabels;
      case activityHistoryTypes.LEGAL_REFERRAL:
        return legalReferralLabels;
      default: {
        return labels;
      }
    }
  }

  render() {
    const {
      activityDetail,
      canGoNext,
      canGoPrevious,
      labels,
      onBack,
      onNext,
      onPrevious,
      values,
      genericErrorText,
      activityError,
      attachments,
      attachmentsLoading,
      attachmentsError,
    } = this.props;
    const ActivityItemComponent = activityDetail ? HistoryItem[activityDetail.type] : null;

    const filesTableData = attachments.map(file => [
      <Button isText onClick={() => downloadFile(file.uri, file.name)}>
        <AttachmentsTableFileName name={file.name} />
      </Button>,
    ]);

    const renderAttachments = () => {
      if (!activityDetail) {
        return null;
      }
      if (attachmentsLoading) {
        return <Loader />;
      }
      if (attachmentsError) {
        return <ErrorMessage>{genericErrorText}</ErrorMessage>;
      }
      if (attachments.length) {
        return (
          <AttachmentsWrapper>
            <Typography.Label>{'Attachments'}</Typography.Label>
            <TableWrapper>
              <Pagination
                initialPageSize={6}
                items={filesTableData}
                pageSize={6}
                render={items => <Table addExtraTd={false} tdWrap data={items} />}
              />
            </TableWrapper>
          </AttachmentsWrapper>
        );
      }
      return null;
    };

    const mainElementNode = this.props.activityLoading ? (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    ) : (
      ActivityItemComponent && (
        <React.Fragment>
          <ActivityItemWrapper>
            <ActivityItemComponent
              {...activityDetail}
              labels={activityDetail ? this.getLabels(activityDetail.type) : {}}
              values={values}
            />
          </ActivityItemWrapper>
          {renderAttachments()}
        </React.Fragment>
      )
    );

    return (
      <PageContent>
        <div className="col-lg-9">
          <Wrapper>
            <CustomerDetailsContainer>
              <PropertyInformation />
            </CustomerDetailsContainer>
            <PaddedBox>
              {activityError ? (
                <ActivityItemWrapper>
                  <ErrorMessage>{genericErrorText}</ErrorMessage>
                </ActivityItemWrapper>
              ) : (
                mainElementNode
              )}
              <ActionButtonsWrapper>
                <Button
                  buttonType="secondary"
                  data-bdd={'ActivityItem-back'}
                  type="button"
                  onClick={onBack}
                  isFullWidth
                >
                  {labels.back}
                </Button>
                <Button
                  buttonType="primary"
                  data-bdd={'ActivityItem-previous'}
                  disabled={!canGoPrevious}
                  type="button"
                  onClick={onPrevious}
                  isFullWidth
                >
                  {labels.previous}
                </Button>
                <Button
                  buttonType="primary"
                  data-bdd={'ActivityItem-next'}
                  disabled={!canGoNext}
                  type="button"
                  onClick={onNext}
                  isFullWidth
                >
                  {labels.next}
                </Button>
              </ActionButtonsWrapper>
            </PaddedBox>
          </Wrapper>
        </div>
      </PageContent>
    );
  }
}

export const referralLabelsPropType = {
  createdOn: PropTypes.string,
  details: PropTypes.string,
  heading: PropTypes.string,
  raisedBy: PropTypes.string,
  referrableTeams: PropTypes.string,
};

export const legalReferralPropType = {
  approval: PropTypes.string.isRequired,
  by: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  lastModifiedOn: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  progressStatus: PropTypes.string.isRequired,
  rejected: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export const paymentLabelsPropType = {
  CardPayment: PropTypes.string.isRequired,
  createdBy: PropTypes.string.isRequired,
  createdOn: PropTypes.string.isRequired,
  DirectDebit: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  firstPayment: PropTypes.string.isRequired,
  frequency: PropTypes.shape({
    Fortnightly: PropTypes.string.isRequired,
    Fourweekly: PropTypes.string.isRequired,
    HalfYearly: PropTypes.string.isRequired,
    LastFridayOfTheMonth: PropTypes.string.isRequired,
    Monthly: PropTypes.string.isRequired,
    Quarterly: PropTypes.string.isRequired,
    Weekly: PropTypes.string.isRequired,
    Yearly: PropTypes.string.isRequired,
  }).isRequired,
  heading: PropTypes.string.isRequired,
  instalmentAmount: PropTypes.string.isRequired,
  paymentAmount: PropTypes.string.isRequired,
  paymentFrequency: PropTypes.string.isRequired,
  paymentMethod: PropTypes.string.isRequired,
  paymentStatus: PropTypes.string.isRequired,
  RecurringCard: PropTypes.string.isRequired,
};

export const paymentPlanLabelsPropType = {
  createdOn: PropTypes.string,
  details: PropTypes.string,
  heading: PropTypes.string,
  raisedBy: PropTypes.string,
  referrableTeams: PropTypes.string,
};

export const pauseLabelsPropType = {
  heading: PropTypes.string,
  status: PropTypes.string,
  reason: PropTypes.string,
  endDate: PropTypes.string,
  furtherDetail: PropTypes.string,
  isExtended: PropTypes.string,
  originalStartDate: PropTypes.string,
  lastModifiedOn: PropTypes.string,
  lastModifiedBy: PropTypes.string,
  createdOn: PropTypes.string,
  createdBy: PropTypes.string,
  isApproved: PropTypes.string,
  isRejected: PropTypes.string,
  approvedOn: PropTypes.string,
  ApprovedBy: PropTypes.string,
  ownerName: PropTypes.string,
  cancelReason: PropTypes.string,
  notified: PropTypes.string,
  notifiedOn: PropTypes.string,
};

ActivityHistoryItemComposition.defaultProps = {
  activities: [],
  activityDetail: null,
  activityError: false,
  activityLoading: true,
};

ActivityHistoryItemComposition.propTypes = {
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      uri: PropTypes.string.isRequired,
    })
  ).isRequired,
  attachmentsError: PropTypes.bool.isRequired,
  attachmentsLoading: PropTypes.bool.isRequired,
  canGoNext: PropTypes.bool.isRequired,
  canGoPrevious: PropTypes.bool.isRequired,
  genericErrorText: PropTypes.string.isRequired,
  getActivityById: PropTypes.func.isRequired,
  getActivityHistory: PropTypes.func.isRequired,
  invalidateActivityDetail: PropTypes.func.isRequired,
  itemId: PropTypes.string.isRequired,
  labels: PropTypes.shape({
    back: PropTypes.string.isRequired,
    next: PropTypes.string.isRequired,
    previous: PropTypes.string.isRequired,
  }).isRequired,
  legalReferralLabels: PropTypes.shape(pauseLabelsPropType).isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  pauseLabels: PropTypes.shape(pauseLabelsPropType).isRequired,
  paymentLabels: PropTypes.shape(paymentLabelsPropType).isRequired,
  paymentPlanLabels: PropTypes.shape(paymentPlanLabelsPropType).isRequired,
  referralLabels: PropTypes.shape(referralLabelsPropType).isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  activities: PropTypes.array,
  activityDetail: PropTypes.shape({
    type: PropTypes.oneOf([
      activityHistoryTypes.INTERACTION,
      activityHistoryTypes.REFERRAL,
      activityHistoryTypes.PAUSE,
      activityHistoryTypes.PAYMENT,
      activityHistoryTypes.PAYMENT_PLAN,
      activityHistoryTypes.LEGAL_REFERRAL,
    ]).isRequired,
  }),
  activityError: PropTypes.bool,
  activityLoading: PropTypes.bool,
};

export default connect(ActivityHistoryItemComposition);
