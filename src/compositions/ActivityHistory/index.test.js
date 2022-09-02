import React from 'react';
import { shallow } from 'enzyme';

import { ActivityHistoryComposition } from './';

describe('<ActivityHistoryComposition />', () => {
  let props;
  let activity;
  let el;

  beforeEach(() => {
    activity = id => ({
      createdBy: {
        displayName: 'Fred',
      },
      summary: 'A summary',
      id,
      modifiedAt: '2018-08-31T20:52:35+00:00',
      type: 'Email',
    });

    props = {
      arrearsId: 'ABC123',
      getActivityHistory: jest.fn(),
      invalidateActivityHistory: jest.fn(),
      heading: 'A heading',
      labels: {
        date: 'date',
        detail: 'detail',
        name: 'name',
      },
      activityHistory: [activity('abc123'), activity('def456')],
    };

    el = shallow(<ActivityHistoryComposition {...props} />);
  });

  it('should call getActivityHistory', () => {
    expect(props.getActivityHistory).toHaveBeenCalled();
  });

  it('should render with activities', () => {
    expect(el).toMatchSnapshot();
  });

  it('should not render with no activities', () => {
    el.setProps({
      activityHistory: [],
    });
    expect(el).toMatchSnapshot();
  });

  it('sorting activity history by created date', () => {
    el.setProps({
      activityHistory: [
        {
          id: 'f31eed47-8dbf-4c62-8647-221c04f6f2ff',
          baseType: 'Activity',
          type: 'Phone Call',
          createdAt: '2021-02-24T09:38:40+00:00',
          modifiedAt: '2021-02-24T09:38:41+00:00',
          createdBy: {
            displayName: 'Navis Michael',
            id: 'd907cefc-3b45-eb11-80f8-005056825b41',
            type: 'employee',
          },
        },
        {
          id: 'c72a6a32-1723-48c9-bbd2-0fd7bc6f96ec',
          baseType: 'Activity',
          type: 'Letter',
          createdAt: '2021-02-24T09:38:01+00:00',
          modifiedAt: '2021-02-24T09:38:02+00:00',
          createdBy: {
            displayName: 'Navis Michael',
            id: 'd907cefc-3b45-eb11-80f8-005056825b41',
            type: 'employee',
          },
        },
        {
          id: 'e0e61311-b875-eb11-80fb-005056825b41',
          baseType: 'Activity',
          type: 'Pause',
          createdAt: '2021-02-23T09:18:19+00:00',
          modifiedAt: '2021-02-23T09:21:45+00:00',
          createdBy: {
            displayName: 'Yadwinder Hunjan',
            id: '6ee5be56-3c45-eb11-80f8-005056825b41',
            type: 'employee',
          },
        },
      ],
    });
    expect(el).toMatchSnapshot();
  });

  it('should render a Loader when loading', () => {
    el.setProps({
      loading: true,
    });
    expect(el).toMatchSnapshot();
  });

  it('should call invalidateTasks on UnMount', () => {
    el.unmount();
    expect(props.invalidateActivityHistory).toHaveBeenCalled();
  });
});
