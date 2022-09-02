import React from 'react';
import { shallow } from 'enzyme';
import * as nhhStyles from 'nhh-styles';
import { TasksSummaryCardsComponent } from './';
import NoDataMessage from '../../components/NoDataMessage';

nhhStyles.formatting.formatDate = jest.fn(() => '10/08/2018 - 8:52pm');

describe('<TasksSummaryCardsComponent />', () => {
  let props;

  beforeEach(() => {
    props = {
      loading: false,
      noDataMsg: 'there is no data sorry',
      resultCount: 2,
      getNextPage: () => {},
      tasks: [
        {
          id: 'foo',
          type: 'manual',
          status: 'Open',
          title: 'this is a title',
          dueDate: '2018-08-27T15:08:44+00:00',
          owner: {
            id: 'DEF456',
            name: 'Jim Bob',
            type: 'systemusers',
          },
          regardingObjectModel: { id: 'bar', type: 'Arrears' },
          assetName: '666 Craven Rd',
          tenantName: 'Dylan Dog',
        },
        {
          id: 'bar',
          type: 'system',
          status: 'Open',
          title: 'this is a title',
          dueDate: '2018-08-27T15:08:44+00:00',
          owner: {
            id: 'ABC123',
            name: 'Fred Bloggs',
            type: 'systemusers',
          },
          regardingObjectModel: { id: 'foo', type: 'Arrears' },
          assetName: 'Beverly Hills',
          tenantName: 'Lennox Lewis',
        },
      ],
      cardLabels: {
        heading: 'Tasks',
        dueDate: 'Due Date',
        taskOwner: 'Task Owner',
        title: 'Title',
        customerName: 'Customer Name',
        address: 'Address',
        status: 'Status',
        overdue: 'overdue!',
      },
      theme: {
        colors: {
          secondary: 'hotpink',
          support: {
            one: 'red',
            two: 'blue',
          },
        },
      },
      userId: 'ABC123',
      youText: 'You',
    };
  });

  it('renders correctly', () => {
    expect(shallow(<TasksSummaryCardsComponent {...props} />)).toMatchSnapshot();
  });

  it('renders correctly when loading', () => {
    const testProps = { ...props, loading: true };
    const el = shallow(<TasksSummaryCardsComponent {...testProps} />);
    expect(el.find(nhhStyles.Loader).length).toBe(1);
  });

  it('renders correctly when there is no data', () => {
    let testProps = { ...props, tasks: [] };
    let el = shallow(<TasksSummaryCardsComponent {...testProps} />);
    expect(el.find(NoDataMessage).length).toBe(1);

    testProps = { ...props, tasks: null };
    el = shallow(<TasksSummaryCardsComponent {...testProps} />);
    expect(el.find(NoDataMessage).length).toBe(1);
  });
});
