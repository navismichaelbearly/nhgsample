import React from 'react';
import { shallow } from 'enzyme';
import * as nhhStyles from 'nhh-styles';
import LegalReferral from './LegalReferral';

nhhStyles.formatting.formatDate = jest.fn(() => '10/08/2018 - 8:52pm');

describe('<LegalReferral />', () => {
  let props;

  beforeEach(() => {
    process.env.TZ = 'UTC';
    props = {
      id: 'f326549a-fb4d-43cd-855d-e5909dd951a1',
      progressStatus: 'CourtPackRequiresHomApproval',
      owner: {
        id: 'f7fe2806-6aa1-e811-80ce-005056825b41',
        name: 'CRMAppPool NonProd',
        type: 'systemuser',
      },
      formName: 'PRH Legal Referral Form | prh-legal-case-referral',
      approvalDetail: { userName: '', decisionDate: '', isApproved: false },
      lastModifiedAt: '2018-10-24T14:35:29Z',
      lastModifiedBy: 'CRMAppPool NonProd',
      createdAt: '2018-10-24T14:35:29Z',
      createdBy: 'CRMAppPool NonProd',
      status: 'In Progress',
      formServiceSubmissionId: 'ea1c9c52-d060-4cfc-82b6-c3e8740aa685',
      referralPack: {
        legalReferralForm: { link: '', type: 'letter', status: '', errorMessages: null },
        legalReferralPack: {
          link: 'this is a link',
          type: 'letter',
          status: 'Success',
          errorMessages: null,
        },
      },
      originalType: 'Legal Referral',
      labels: {
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
    };
  });

  it('renders correctly', () => {
    expect(shallow(<LegalReferral {...props} />)).toMatchSnapshot();
  });

  it('renders correctly when complete ', () => {
    expect(
      shallow(<LegalReferral {...{ ...props, progressStatus: 'Complete' }} />)
    ).toMatchSnapshot();
  });

  it('renders correctly when rejected', () => {
    expect(
      shallow(<LegalReferral {...{ ...props, progressStatus: 'HeaderDocRejected' }} />)
    ).toMatchSnapshot();
  });
});
