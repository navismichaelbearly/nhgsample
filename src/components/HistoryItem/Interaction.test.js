import React from 'react';
import { shallow } from 'enzyme';
import * as nhhStyles from 'nhh-styles';
import Interaction from './Interaction';

nhhStyles.formatting.formatDate = jest.fn(() => '10/08/2018 - 8:52pm');

describe('<Interaction />', () => {
  let props;

  beforeEach(() => {
    process.env.TZ = 'UTC';
    props = {
      activityTime: '2018-08-10T20:52:35+00:00',
      activityType: 'Type',
      created: {
        on: '2018-08-11T20:52:35+00:00',
      },
      description: 'A description',
      from: {
        name: 'Fred Bloggs',
      },
      to: {
        name: 'Jim Bob',
      },
      labels: {
        createdOn: '2018-08-12T20:52:35+00:00',
        description: 'Description',
        interactionTime: 'Date/time of interaction',
        interactionType: 'Interaction type',
        interactionWith: 'Interaction with',
        modified: 'Last modified',
        raisedBy: 'Raised by',
      },
      modified: {
        on: '2018-08-12T20:52:35+00:00',
      },
      owner: 'Joe Bloggs',
      values: {
        inbound: 'Inbound',
        interactionWith: '{name} ({type})',
        outbound: 'Outbound',
      },
    };
  });

  it('renders correctly', () => {
    expect(shallow(<Interaction {...props} />)).toMatchSnapshot();
  });

  it('renders correctly with an HTML description', () => {
    const testProps = { ...props, description: '<p>I am <a href="#">HTML</a></p>' };
    expect(shallow(<Interaction {...testProps} />)).toMatchSnapshot();
  });

  it('renders correctly with incoming true', () => {
    expect(shallow(<Interaction {...props} incoming />)).toMatchSnapshot();
  });
});
