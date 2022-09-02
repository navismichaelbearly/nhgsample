import React from 'react';
import { shallow } from 'enzyme';
import * as nhhStyles from 'nhh-styles';
import Pause from './Pause';

nhhStyles.formatting.formatDate = jest.fn(() => '10/08/2018 - 8:52pm');

describe('<Pause />', () => {
  let props;

  beforeEach(() => {
    process.env.TZ = 'UTC';
    props = {
      type: 'Pause',
      status: 'Active',
      reasonId: 'newbenefituc',
      endDate: '2018-10-18T00:00:00Z',
      furtherDetail: 'This is a pause',
      isExtended: false,
      originalStartDate: '2018-10-04T00:00:00Z',
      lastModifiedAt: '2018-10-04T15:32:35Z',
      lastModifiedBy: 'SYSTEM',
      createdAt: '2018-10-04T15:32:32Z',
      createdBy: 'Stephanie Golder',
      isManagerNotified: false,
      approvalDetail: {
        userName: 'system',
        decisionDate: '2018-10-04T00:00:00Z',
        isApproved: true,
      },
      owner: {
        id: '039a3660-bd18-e811-80c8-005056825b41',
        name: 'Stephanie Golder',
        type: 'systemuser',
      },
      raisedBy: {
        id: '039a3660-bd18-e811-80c8-005056825b41',
        name: 'Stephanie Golder',
        type: 'systemuser',
      },
      cancelReason: '',
      notifcationDetail: { notifiedUserName: 'Hannah Ike', wasNotified: false },
      labels: {
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
    };
  });

  describe('with approval detail', () => {
    it('renders correctly with status = Active, isManagerNotified = false', () => {
      expect(shallow(<Pause {...props} />)).toMatchSnapshot();
    });

    it('renders correctly with status = Active, isManagerNotified = true', () => {
      expect(shallow(<Pause {...{ ...props, isManagerNotified: true }} />)).toMatchSnapshot();
    });

    it('renders correctly with status = Draft, isManagerNotified = false', () => {
      expect(shallow(<Pause {...{ ...props, status: 'Draft' }} />)).toMatchSnapshot();
    });

    it('renders correctly with status = Draft, isManagerNotified = true', () => {
      expect(
        shallow(<Pause {...{ ...props, status: 'Draft', isManagerNotified: true }} />)
      ).toMatchSnapshot();
    });
  });

  describe('without approval detail', () => {
    props = { ...props, approvalDetail: {} };

    it('renders correctly with status = Active, isManagerNotified = false', () => {
      expect(shallow(<Pause {...props} />)).toMatchSnapshot();
    });

    it('renders correctly with status = Active, isManagerNotified = true', () => {
      expect(shallow(<Pause {...{ ...props, isManagerNotified: true }} />)).toMatchSnapshot();
    });

    it('renders correctly with status = Draft, isManagerNotified = false', () => {
      expect(shallow(<Pause {...{ ...props, status: 'Draft' }} />)).toMatchSnapshot();
    });

    it('renders correctly with status = Draft, isManagerNotified = true', () => {
      expect(
        shallow(<Pause {...{ ...props, status: 'Draft', isManagerNotified: true }} />)
      ).toMatchSnapshot();
    });
  });
});
