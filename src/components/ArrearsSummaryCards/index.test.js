import React from 'react';
import { shallow } from 'enzyme';

import { ArrearsSummaryCardsComponent } from './';

describe('<ArrearsSummaryCardsComponent />', () => {
  let props;

  beforeEach(() => {
    props = {
      loading: false,
      noDataMsg: 'there is no data sorry',
      filterLabel: 'filterLabel',
      arrears: [
        {
          createdOn: '2018-07-16T13:47:18.778Z',
          currentBalance: 100,
          openTaskCount: 12,
          tenancy: {
            address: 'A Road, Anywhere',
            name: 'Fred',
          },
          ownerOutputModel: {
            id: 'ABC123',
            name: 'Fred Bloggs',
          },
        },
        {
          createdOn: '2018-04-10T13:47:18.778Z',
          currentBalance: 50,
          openTaskCount: 2,
          tenancy: {
            address: 'Another Road, Anywhere Else',
            name: 'Jim',
          },
          ownerOutputModel: {
            id: 'DEF456',
            name: 'Jim Bob',
          },
        },
      ],
      cardLabels: {
        address: 'Address',
        currentBalance: 'Current balance',
        heading: 'Arrears',
        notificationDate: 'Notification date',
        openTasks: 'Open tasks',
        tenantName: 'Tenant name',
      },
      resultsCount: 10,
      theme: {
        colors: {
          support: {
            one: 'red',
          },
        },
      },
      userId: 'ABC123',
      youText: 'You',
      getArrearsSummary: jest.fn(),
    };
  });

  it('renders correctly with arrears', () => {
    expect(shallow(<ArrearsSummaryCardsComponent {...props} />)).toMatchSnapshot();
  });

  it('renders correctly when loading', () => {
    const el = shallow(<ArrearsSummaryCardsComponent {...props} />);
    el.setProps({ loading: true });
    expect(el).toMatchSnapshot();
  });

  it('renders correctly when there is no data and it is not loading', () => {
    const el = shallow(<ArrearsSummaryCardsComponent {...props} />);
    el.setProps({ arrears: [] }).update();
    expect(el).toMatchSnapshot();
  });

  it('renders correctly with no tennant details', () => {
    delete props.arrears[0].tenancy;
    expect(shallow(<ArrearsSummaryCardsComponent {...props} />)).toMatchSnapshot();
  });

  it('renders correctly with no balance', () => {
    delete props.arrears[0].currentBalance;
    expect(shallow(<ArrearsSummaryCardsComponent {...props} />)).toMatchSnapshot();
  });

  it.skip('fires getArrearsSummary when load more is clicked', () => {
    const el = shallow(<ArrearsSummaryCardsComponent {...props} />);
    const pagination = el.find('Pagination').props();
    pagination.onNextPage({ pageNumber: 1 });
    expect(props.getArrearsSummary).toHaveBeenCalledWith({ pageNumber: 1 });
  });
});
