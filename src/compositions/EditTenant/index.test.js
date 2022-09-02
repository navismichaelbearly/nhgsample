import React from 'react';
import { shallow } from 'enzyme';

import { EditTenantComposition } from './';

describe('<EditTenantComposition />', () => {
  let props;

  beforeEach(() => {
    props = {
      isLoading: false,
      errorMessages: {
        emailAddressError: 'emailAddressError',
        phoneNumberError: 'phoneNumberError',
        submitError: 'There was a problem updating your details, please try again.',
      },
      heading: 'heading',
      labels: {
        cancelButtonText: 'cancelButtonText',
        closeButtonText: 'closeButtonText',
        confirmationText: 'confirmationText',
        errorText: 'errorText',
        emailAddressLabel: 'emailAddressLabel',
        fullNameLabel: 'fullNameLabel',
        phoneNumberLabel: 'phoneNumberLabel',
        updateButtonText: 'updateButtonText',
      },
      onCancel: () => {},
      onSubmit: jest.fn(),
      onUnmount: jest.fn(),
      subheading: 'subheading',
      tenant: {
        fullName: 'tenant.fullName',
        id: 'tenant.id',
        emailAddress: 'tenant.emailAddress',
        telephoneNumber: 'tenant.telephoneNumber',
      },
    };
  });

  it('renders correctly when loading', () => {
    expect(shallow(<EditTenantComposition {...{ ...props, isLoading: true }} />)).toMatchSnapshot();
  });

  it('renders correctly with full props', () => {
    expect(shallow(<EditTenantComposition {...props} />)).toMatchSnapshot();
  });

  it('renders correctly with no email or phone', () => {
    delete props.tenant.emailAddress;
    delete props.tenant.telephoneNumber;
    expect(shallow(<EditTenantComposition {...props} />)).toMatchSnapshot();
  });

  // it('handleSubmit fires the onsubmit prop with the correct values', () => {
  //   const el = shallow(<EditTenantComposition {...props} theme={{}} />);
  //   el.find('EditContactDetails')
  //     .props()
  //     .onSubmit('email', 'phone');
  //   expect(props.onSubmit).toHaveBeenCalledWith('tenant.id', {
  //     emailAddress: 'email',
  //     mobileTelephoneNumber: 'phone',
  //   });
  // });[TODO]

  it('should fire onUnmount on unmount ', () => {
    const el = shallow(<EditTenantComposition {...props} />);
    el.unmount();
    expect(props.onUnmount).toBeCalled();
  });
});
