import React from 'react';
import { shallow } from 'enzyme';

import { ArrearsDetailComposition } from './';

import { TenancyTransactions } from '../';

describe('<ArrearsDetailComposition />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      arrearsId: 'foo',
      addNotification: jest.fn(),
      closeTemplate: jest.fn(),
      location: {
        search: {},
      },
      openTemplate: jest.fn(),
      documentLabels: {
        heading: 'Documents ({count})',
        filename: 'FILE NAME',
        date: 'DATE ADDED',
        user: 'CREATED BY',
        link: 'View document',
      },
      genericErrorText: 'this is an error',
      documents: {
        downloadedFiles: [],
        downloadError: null,
        loading: false,
        loaded: false,
        downloadFile: jest.fn(),
        invalidateList: jest.fn(),
        getList: jest.fn(),
      },
      notes: {
        items: [
          {
            id: 'a143b7a5-0f6e-4eeb-9398-a897c3d2cec7',
            caseId: '00000000-0000-0000-0000-000000000000',
            created: { by: null, on: '2018-10-31T14:41:31+00:00' },
            modified: { by: null, on: '2018-10-31T14:41:31+00:00' },
            subject: 'Note added via Arrears',
            text:
              'this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note this is a very long note ',
          },
        ],
        loading: false,
        loaded: true,
        error: false,
        invalidateList: jest.fn(),
        getList: jest.fn(),
      },
      notesText: {
        heading: 'Notes ({count})',
        labels: {
          date: 'Date',
          filename: 'Filename',
          fileUploadStatus: 'FileUploadStatus',
          name: 'Name',
        },
      },
      redirectToDetailsPage: jest.fn(),
      getTenancyTransactions: jest.fn(),
      loadLinkedCases: jest.fn(),
      getWelfareReformDetails: jest.fn(),
      arrearsDetailsLabels: {
        lengthOfArrears: 'Length of arrears',
        lengthOfArrearsValue: '{days} days (case started on {date})',
        none: 'None',
        patchOwner: 'Patch owner',
        pauses: {
          active: '(active)',
          draftLabel: 'Draft pauses',
          draftPausePeriod: 'Requested from {from} to {to}',
          label: 'Pauses',
          pausePeriod: 'Paused from {from} to {to}',
          pendingApproval: '(pending approval)',
        },
        paymentPlan: {
          endDate: 'End date:',
          frequency: 'Frequency:',
          instalmentAmount: 'Instalment amount:',
          label: 'Payment plan',
          period: 'Period:',
          startDate: 'Start date:',
          type: 'Type:',
        },
        referralStatus: {
          label: 'Referrals',
          value: '{team}, {date}',
        },
        status: 'Arrears status',
        workwiseReference: 'Workwise reference',
      },
      informationHeading: 'informationHeading',
      legalActions: {
        expiringSoon: 'expiringSoon',
        expiryDate: 'expiryDate',
        heading: 'legalActions heading',
        headingExpiring: 'headingExpiring',
        labels: {
          createdOn: 'labels createdOn',
          expires: 'labels expires',
          owner: 'labels owner',
          status: 'labels status',
        },
      },
      loadTenancyTransactions: true,
      phasesHeading: 'phasesHeading',
      removeNotification: jest.fn(),
      updatePageHeader: jest.fn(),
      arrearsDetail: {
        allDetails: true,
        arrearsLength: 5,
        createdOn: '2018-07-15T13:12:07.193Z',
        owner: {
          name: 'Fred',
        },
        pauseSummary: [
          {
            expiryDate: '2017-04-23T13:12:07.193Z',
            startDate: '2018-07-15T13:12:07.193Z',
            status: 'Active',
          },
        ],
        paymentPlan: {
          endDate: '2017-04-23T13:12:07.193Z',
          installment: {
            amount: 50,
            period: 2,
            schedule: 'Weekly',
          },
          startDate: '2018-07-15T13:12:07.193Z',
          type: 'Foo',
        },
        referralSummaries: [
          {
            createdOn: '2018-07-15T13:12:07.193Z',
            teamName: 'Jim',
          },
          {
            createdOn: '2017-04-23T13:12:07.193Z',
            teamName: 'Bob',
          },
        ],
        status: 'Active',
        workwiseReferenceNumber: '12345',
        legalReferral: {
          title: 'legalReferral',
          createdOn: '2018-07-15T13:12:07.193Z',
        },
        primaryLegalAction: {
          title: 'primaryLegalAction',
          createdOn: '2017-04-23T13:12:07.193Z',
        },
        refferalPack: {
          legalReferralPack: {
            link: '/alink',
          },
        },
      },
    };

    el = shallow(<ArrearsDetailComposition {...props} />);
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should update the header', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should call notes.getList()', () => {
    expect(props.notes.getList).toHaveBeenCalled();
  });

  it('should call addNotification if primaryLegalAction.notifyOfPendingExpiry is true', () => {
    props.arrearsDetail.primaryLegalAction.notifyOfPendingExpiry = true;
    el = shallow(<ArrearsDetailComposition {...props} />);
    expect(props.addNotification).toHaveBeenCalled();
    expect(props.addNotification.mock.calls).toMatchSnapshot();
  });

  it('should render the page correctly without legalReferral', () => {
    delete props.arrearsDetail.legalReferral;
    expect(shallow(<ArrearsDetailComposition {...props} />)).toMatchSnapshot();
  });

  it('should render the page correctly without primaryLegalAction', () => {
    delete props.arrearsDetail.primaryLegalAction;
    expect(shallow(<ArrearsDetailComposition {...props} />)).toMatchSnapshot();
  });

  it('should render the page correctly while arrears is being populated', () => {
    props.arrearsDetail = null;
    expect(shallow(<ArrearsDetailComposition {...props} />)).toMatchSnapshot();
  });

  it('should not render TenancyTransactions if loadTenancyTransactions if false', () => {
    props.loadTenancyTransactions = false;
    const result = shallow(<ArrearsDetailComposition {...props} />);
    expect(result.find(TenancyTransactions).length).toBe(0);
  });

  it('should render when notes are loading', () => {
    el.setProps({ notes: { loaded: false, loading: true, ...props.notes } });
    expect(el).toMatchSnapshot();
  });

  describe('phase indicator', () => {
    it('should render the page correctly when there are no phases', () => {
      props.arrearsDetail.phases = [];
      expect(shallow(<ArrearsDetailComposition {...props} />)).toMatchSnapshot();
    });
    it('should render the page correctly when there are no active phases', () => {
      props.arrearsDetail.phases = [{ name: 'Phase 1' }, { name: 'Phase 2' }];
      expect(shallow(<ArrearsDetailComposition {...props} />)).toMatchSnapshot();
    });
    it('should render the page correctly with an active phase', () => {
      props.arrearsDetail.phases = [{ name: 'Phase 1', active: true }, { name: 'Phase 2' }];
      expect(shallow(<ArrearsDetailComposition {...props} />)).toMatchSnapshot();
    });

    it('should call removeNotification on unmount', () => {
      el.unmount();
      expect(props.removeNotification).toHaveBeenCalled();
    });

    it('should display external notification if it is passed through query string', () => {
      props.arrearsDetail.primaryLegalAction.notifyOfPendingExpiry = true;
      props.location.search = {
        notificationIcon: 'success',
        notificationTitle: 'Hello world',
        notificationBody: 'This is a message',
      };

      el = shallow(<ArrearsDetailComposition {...props} />);
      expect(props.addNotification).toHaveBeenCalledWith({
        dataDbbPrefix: 'externalAppNotification',
        icon: 'success',
        lines: [{ dataBdd: 'externalNotificationLine0', text: 'This is a message' }],
        title: 'Hello world',
      });
    });

    it('should call getTenancyTransactions when receiving a partyId', () => {
      el.setProps({ partyId: '1234' });
      expect(props.getTenancyTransactions).toHaveBeenCalled();
    });
  });

  describe('Display modals', () => {
    it('should call passed in openTemplate with serveNOSP template when the correct props are passed in', () => {
      el.setProps({
        modalToShow: 'serveNOSP',
      });
      expect(props.openTemplate).toHaveBeenCalled();
      expect(props.openTemplate.mock.calls[0][0]).toMatchSnapshot();
    });

    it('should not call the passed in openTemplate if the template is not found', () => {
      el.setProps({
        modalToShow: 'not going to match anything',
      });
      expect(props.openTemplate).not.toHaveBeenCalled();
    });
  });
});
