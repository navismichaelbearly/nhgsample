import React from 'react';
import { shallow } from 'enzyme';

import state from '../../../__mocks__/state';
import { ActivityHistoryItemComposition } from './';

const mockState = state();

const activityDetail = {
  type: 'Referral',
  createdOn: '2018-09-17T00:00:00+00:00',
  details: 'test',
  raisedBy: { id: 'string', name: 'test', type: 'system' },
  teamName: {
    referrableTeams: [
      {
        id: 'string',
        name: 'string',
      },
      {
        id: 'string',
        name: 'string',
      },
      {
        id: 'string',
        name: 'string',
      },
    ],
  },
};

const defaultProps = {
  attachments: [],
  attachmentsLoading: false,
  attachmentsError: false,
  activities: mockState.activities.history,
  activityLoading: false,
  activityError: false,
  canGoNext: true,
  canGoPrevious: true,
  getActivityById: jest.fn(),
  invalidateActivityDetail: jest.fn(),
  getActivityHistory: jest.fn(),
  legalReferralLabels: {
    approval: 'Approval on',
    by: 'by',
    createdAt: 'Referral date',
    createdBy: 'Raised by contact',
    formName: 'Legal case referral type',
    lastModifiedOn: 'Last modified on',
    link: 'Link to Referral',
    owner: 'Owner',
    progressStatus: 'string',
    rejected: 'Rejected on',
    status: 'Status',
  },
  itemId: 'itemId',
  labels: mockState.dictionary.activityHistory.labels,
  onBack: jest.fn(),
  onNext: jest.fn(),
  onPrevious: jest.fn(),
  updatePageHeader: jest.fn(),
  values: mockState.dictionary.activityHistory.values,
  referralLabels: {
    teamName: 'Referred Team',
    detail: 'Detail',
    raisedBy: 'Raised By',
    createdOn: 'Created',
    heading: 'Referral',
  },
  pauseLabels: {
    heading: 'Pause',
    status: 'Current state',
    reason: 'Reason',
    endDate: 'End Date',
    furtherDetail: 'Details',
    isExtended: '(EXTENDED)',
    originalStartDate: 'Start Date',
    lastModifiedOn: 'Last modified on',
    lastModifiedBy: 'By',
    createdOn: 'Created on',
    createdBy: 'By',
    isApproved: 'Approved',
    isRejected: 'Rejected',
    approvedOn: 'On',
    approvedBy: 'By',
    ownerName: 'Assigned to',
    cancelReason: 'Cancel Reason',
    notified: 'Notification sent to',
    notifiedOn: 'On',
  },
  paymentLabels: {
    CardPayment: 'CardPayment',
    createdBy: 'createdBy',
    createdOn: 'createdOn',
    DirectDebit: 'DirectDebit',
    endDate: 'endDate',
    firstPayment: 'firstPayment',
    frequency: {
      Fortnightly: 'Fortnightly',
      Fourweekly: 'Fourweekly',
      HalfYearly: 'HalfYearly',
      LastFridayOfTheMonth: 'LastFridayOfTheMonth',
      Monthly: 'Monthly',
      Quarterly: 'Quarterly',
      Weekly: 'Weekly',
      Yearly: 'Yearly',
    },
    heading: 'heading',
    instalmentAmount: 'instalmentAmount',
    paymentAmount: 'paymentAmount',
    paymentFrequency: 'paymentFrequency',
    paymentMethod: 'paymentMethod',
    paymentStatus: 'paymentStatus',
    RecurringCard: 'RecurringCard',
  },
  paymentPlanLabels: {
    heading: 'Payment Plan',
    backButton: 'Back',
    closeButton: 'Close Payment Plan',
    closePlanDisclaimer:
      'Closing this payment plan will not automatically terminate the financial arrangement. Separate action required',
    closePlanDescription: 'Are you sure you want to close this payment plan?',
    closePlanNo: 'No',
    closePlanYes: 'Yes, Close the plan',
    endDate: 'End date',
    installmentAmount: 'Instalment amount',
    installmentFrequency: 'Instalment frequency',
    installment: 'Instalment',
    installmentPeriod: 'Instalment period',
    note: 'Note',
    paymentPlanType: 'Payment plan type',
    pleaseSelectAReason: 'Please select a reason...',
    raisedBy: 'Raised by',
    reasonSelect: 'Select reason',
    reasonText: 'Enter a description',
    startDate: 'Start date',
    submitButton: 'Create Payment Plan',
    tenantDefaultOption: 'Tenant Default',
    newArrangementOption: 'New Arrangement',
    lastModifiedAt: 'Last modified',
    lastModifiedBy: 'Last Modified By',
    status: 'Status',
    description: 'Details',
    contactName: 'Contact Name',
    detail: 'Detail',
    endedBy: 'Ended By',
  },
  genericErrorText: 'error message',
  activityDetail: null,
};

const render = props => shallow(<ActivityHistoryItemComposition {...defaultProps} {...props} />);

describe('<ActivityHistoryItemComposition />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call invalidateActivityDetail', () => {
    const invalidateActivityDetail = jest.fn();
    render({ invalidateActivityDetail });
    expect(invalidateActivityDetail).toHaveBeenCalled();
  });

  it('should call getActivityHistory', () => {
    const getActivityHistory = jest.fn();
    render({ getActivityHistory });
    expect(getActivityHistory).toHaveBeenCalled();
  });

  it('should call updatePageHeader', () => {
    const updatePageHeader = jest.fn();
    render({ updatePageHeader });
    expect(updatePageHeader).toHaveBeenCalled();
  });

  describe('getActivityById', () => {
    it('should call getActivityById on update if all the conditions are true', () => {
      const getActivityById = jest.fn();
      const itemId = 'asd';
      const wrapper = render({ getActivityById, itemId });
      wrapper.setProps();
      expect(getActivityById).toHaveBeenCalledWith(itemId);
    });

    it('should not call getActivityById if activityDetail is set', () => {
      const getActivityById = jest.fn();
      const wrapper = render({ activityDetail, getActivityById });
      wrapper.setProps();
      expect(getActivityById).not.toHaveBeenCalled();
    });

    it('should not call getActivityById if activityLoading is set', () => {
      const getActivityById = jest.fn();
      const wrapper = render({ activityLoading: true, getActivityById });
      wrapper.setProps();
      expect(getActivityById).not.toHaveBeenCalled();
    });

    it('should not call getActivityById if activityError is set', () => {
      const getActivityById = jest.fn();
      const wrapper = render({ activityError: true, getActivityById });
      wrapper.setProps();
      expect(getActivityById).not.toHaveBeenCalled();
    });

    it('should call getActivityById if itemId has changed', () => {
      const getActivityById = jest.fn();
      const currentItemId = '123';
      const newItemId = '456';
      const wrapper = render({ getActivityById, itemId: currentItemId });
      wrapper.setProps({ itemId: newItemId });
      expect(getActivityById).toHaveBeenCalledWith(newItemId);
    });
  });

  it('should render correctly without an activityDetail', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with documents', () => {
    const wrapper = render({ attachments: [{ name: 'filename.jpg', uri: 'URI' }] });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when loading documents', () => {
    const wrapper = render({ attachmentsLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when documents errors out', () => {
    const wrapper = render({ attachmentsError: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with an activityDetail', () => {
    const wrapper = render({ activityDetail });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with an activityLoading', () => {
    const wrapper = render({ activityLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with an activityError', () => {
    const wrapper = render({ activityError: true });
    expect(wrapper).toMatchSnapshot();
  });
});
