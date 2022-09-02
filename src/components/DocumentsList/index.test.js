import React from 'react';
import { shallow } from 'enzyme';
import * as nhhStyles from 'nhh-styles';

import { DocumentsList } from './';

nhhStyles.formatting.formatDate = jest.fn(() => '10/08/2018 - 8:52pm');

describe('<DocumentsList />', () => {
  let props;

  beforeEach(() => {
    props = {
      theme: nhhStyles.defaultTheme,
      labels: {
        heading: 'Documents ({count})',
        filename: 'FILE NAME',
        date: 'DATE ADDED',
        user: 'CREATED BY',
        link: 'View document',
      },
      dataBdd: 'there is no data sorry',
      downloadFile: jest.fn(),
      documents: [
        {
          name: 'usmans_20181018132401.pdn',
          uri:
            'aHR0cDovL2ludGVybmFsLWRldjIubmhpbGwubmV0L3dvcmt3aXNlL2N1c3RvbWVycy9OSEhXVzI0MDMtVGVuYW50LTIvTkhIV1cyNDAzLTkxMDA1MzExNzYwMDItMzExNzYwMDIvRG9jdW1lbnRzL0FycmVhcnMvQ0FTLTE3MzA1LUs1UDNENy9BY3Rpdml0eS91c21hbnNfMjAxODEwMTgxMzI0MDEucGRu0',
          createdBy: 'DynamicsAATest Test',
          createdOn: '2018-10-18T13:24:10Z',
        },
        {
          name: 'me_twitter_20181022105539.jpg',
          uri:
            'aHR0cDovL2ludGVybmFsLWRldjIubmhpbGwubmV0L3dvcmt3aXNlL2N1c3RvbWVycy9OSEhXVzI0MDMtVGVuYW50LTIvTkhIV1cyNDAzLTkxMDA1MzExNzYwMDItMzExNzYwMDIvRG9jdW1lbnRzL0FycmVhcnMvQ0FTLTE3MzA1LUs1UDNENy9BY3Rpdml0eS9tZV90d2l0dGVyXzIwMTgxMDIyMTA1NTM5LmpwZw2',
          createdBy: 'DynamicsAATest Test',
          createdOn: '2018-10-22T10:55:44Z',
        },
        {
          name: 'km-by-jan-h150_20181023100535.png',
          uri:
            'aHR0cDovL2ludGVybmFsLWRldjIubmhpbGwubmV0L3dvcmt3aXNlL2N1c3RvbWVycy9OSEhXVzI0MDMtVGVuYW50LTIvTkhIV1cyNDAzLTkxMDA1MzExNzYwMDItMzExNzYwMDIvRG9jdW1lbnRzL0FycmVhcnMvQ0FTLTE3MzA1LUs1UDNENy9BY3Rpdml0eS9rbS1ieS1qYW4taDE1MF8yMDE4MTAyMzEwMDUzNS5wbmc1',
          createdBy: 'DynamicsAATest Test',
          createdOn: '2018-10-23T10:05:37Z',
        },
      ],
      error: {
        errorStatus: null,
        message: 'batman was here',
      },
    };
  });

  it('renders correctly', () => {
    expect(shallow(<DocumentsList {...props} />)).toMatchSnapshot();
  });

  it('renders correctly with an error', () => {
    expect(
      shallow(<DocumentsList {...{ ...props, error: { ...props.error, errorStatus: 500 } }} />)
    ).toMatchSnapshot();
  });

  it('renders correctly with an empty list', () => {
    expect(shallow(<DocumentsList {...{ ...props, documents: [] }} />)).toMatchSnapshot();
  });
});
