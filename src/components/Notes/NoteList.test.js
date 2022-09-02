import React from 'react';
import { shallow } from 'enzyme';
import * as nhhStyles from 'nhh-styles';
import NoteList from './NoteList';

nhhStyles.formatting.formatDate = jest.fn(() => '10/08/2018 - 8:52pm');

describe('<NoteList />', () => {
  let props;

  beforeEach(() => {
    props = {
      notes: [
        {
          id: 'e2054c02-08dd-e811-80d2-005056825b41',
          caseId: '00000000-0000-0000-0000-000000000000',
          created: { by: null, on: '2018-10-31T12:25:13+00:00' },
          modified: { by: null, on: '2018-10-31T12:25:13+00:00' },
          subject: 'usman-moses',
          text: 'This is a test note with attachment :)',
        },
      ],
      text: {
        heading: 'Notes ({count})',
        labels: {
          date: 'Date',
          filename: 'Filename',
          fileUploadStatus: 'FileUploadStatus',
          name: 'Name',
        },
      },
    };
  });

  it('renders correctly', () => {
    expect(shallow(<NoteList {...props} />)).toMatchSnapshot();
  });
});
