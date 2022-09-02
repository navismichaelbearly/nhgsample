import React from 'react';
import { shallow } from 'enzyme';
import { PatchSelectComposition as PatchSelect } from './';

describe('<PatchSelect />', () => {
  let props;

  beforeEach(() => {
    props = {
      isHousingOfficer: true,
      myPatch: {
        fullName: 'John S',
        id: '1234',
        patchName: 'ABC',
      },
      onChange: jest.fn(),
      onClose: jest.fn(),
      onSearch: jest.fn(),
      teamMembers: [
        {
          fullName: 'Leon',
          id: '47',
          patchName: 'ABC123',
        },
      ],
      visible: false,
    };
  });

  it('should render correctly when not visible', () => {
    expect(shallow(<PatchSelect {...props} />)).toMatchSnapshot();
  });

  it('should render correctly if not a housing officer', () => {
    props.isHousingOfficer = false;
    expect(shallow(<PatchSelect {...props} />)).toMatchSnapshot();
  });

  it('should render correctly when visible', () => {
    props.visible = true;
    expect(shallow(<PatchSelect {...props} />)).toMatchSnapshot();
  });
});
