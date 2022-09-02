import React from 'react';
import { shallow } from 'enzyme';

import { ArrearsNotifications } from './';

jest.mock('nhh-styles', () => ({
  generateId: () => 'abc123',
  NotificationPanel: props => <div id="NotificationPanel-mock" {...props} />,
  Typography: {
    P: props => <p id="P-mock" {...props} />,
  },
}));

describe('<ArrearsNotifications />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      notifications: [
        {
          dataBddPrefix: 'prefix',
          title: 'notificatin title',
          lines: [{ dataBdd: 'lines', text: 'first line' }, { text: 'second line' }],
          notificationType: 'confirmation',
        },
      ],
      removeNotification: jest.fn(),
    };
    el = shallow(<ArrearsNotifications {...props} />);
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });
});
