import React from 'react';
import { shallow } from 'enzyme';
import { Highlight } from './components';

import LegalActions from './';

describe('<LegalActions />', () => {
  let props;

  beforeEach(() => {
    props = {
      expiringSoon: 'expiringSoon',
      expiryDate: 'expiryDate',
      heading: 'heading',
      labels: {
        createdOn: 'createdOn',
        expires: 'expires',
        owner: 'owner',
        status: 'status',
      },
    };
  });

  it('renders correctly with no legal actions', () => {
    expect(shallow(<LegalActions {...props} />)).toMatchSnapshot();
  });

  it('renders correctly with a primaryLegalAction', () => {
    props.primaryLegalAction = {
      createdOn: '2018-07-15T13:12:07.193Z',
      expiryDate: '2018-07-15T13:12:07.193Z',
      notifyOfPendingExpiry: true,
      title: 'A NOSP',
    };
    expect(shallow(<LegalActions {...props} />)).toMatchSnapshot();
  });

  it('should set isExpiring flag on <Highlight /> set to false when notifyOfPendingExpiry is false', () => {
    props.primaryLegalAction = {
      createdOn: '2018-07-15T13:12:07.193Z',
      expiryDate: '2018-07-15T13:12:07.193Z',
      notifyOfPendingExpiry: false,
      title: 'A NOSP',
    };
    const component = shallow(<LegalActions {...props} />);
    expect(component.find(Highlight).prop('isExpiring', false));
  });

  it('renders correctly with a legalReferral', () => {
    props.primaryLegalAction = {
      createdOn: '2018-07-15T13:12:07.193Z',
      title: 'A Referral',
      status: 'Active',
      raisedBy: {
        name: 'Fred',
      },
      referralPack: {
        legalReferralPack: {
          link: '/alink',
        },
      },
    };
    expect(shallow(<LegalActions {...props} />)).toMatchSnapshot();
  });
});
