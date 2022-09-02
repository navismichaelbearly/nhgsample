import React from 'react';
import { shallow } from 'enzyme';

import { PropertyInformationComposition } from './';

describe('<PropertyInformationComposition />', () => {
  let props;
  let component;

  beforeEach(() => {
    props = {
      address: {
        city: 'City',
        line1: 'Line 1',
        postcode: 'ABC 123',
        line2: 'Line 2',
      },
      getTenantDetails: jest.fn(),
      heading: 'heading',
      labels: {
        address: 'labels.address',
        coTenant: 'labels.coTenant',
        editButton: 'labels.editButton',
        emailAddress: 'labels.emailAddress',
        mainTenant: 'labels.mainTenant',
        telephoneNumber: 'labels.telephoneNumber',
      },
      onEditClick: () => {},
      tenants: [
        {
          fullName: 'Joe Bloggs',
          id: 'ABC',
          emailAddress: 'joe.bloggs@test.com',
          telephoneNumber: '123456',
          vulnerabilityFlag: true,
        },
        {
          fullName: 'Jane Doe',
          id: '123',
          emailAddress: 'jane.doe@test.com',
          telephoneNumber: '123456',
        },
      ],
      theme: {
        colors: {
          support: {
            two: 'red',
          },
        },
      },
    };

    component = shallow(<PropertyInformationComposition {...props} />);
  });

  it('renders correctly with full props', () => {
    expect(component).toMatchSnapshot();
  });

  it('renders correctly with no tenants', () => {
    component.setProps({ tenants: null });
    expect(component).toMatchSnapshot();
  });

  it('should get tenant details', () => {
    expect(props.getTenantDetails).toHaveBeenCalled();
  });
});
