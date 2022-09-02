import React from 'react';
import { shallow } from 'enzyme';
import * as nhhStyles from 'nhh-styles';
import Referral from './Referral';

nhhStyles.formatting.formatDate = jest.fn(() => '10/08/2018 - 8:52pm');

describe('<Referral />', () => {
  let props;

  beforeEach(() => {
    process.env.TZ = 'UTC';
    props = {
      type: 'Referral',
      createdOn: '2018-08-10T20:52:35+00:00',
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
      labels: {
        teamName: 'Referred Team',
        detail: 'Detail',
        raisedBy: 'Raised By',
        createdOn: 'Created',
        heading: 'Referral',
      },
    };
  });

  it('renders correctly', () => {
    expect(shallow(<Referral {...props} />)).toMatchSnapshot();
  });
});
