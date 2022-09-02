import React from 'react';
import { shallow } from 'enzyme';

import {
  AddressTitle,
  GenerateDraftButton,
  GenerateDraftContainer,
  TableWrapper,
  MandatoryField,
  LabelWrapper,
  AttachmentsWrapper,
} from './components';

describe('<AddressTitle />', () => {
  it('should render correctly', () => {
    expect(shallow(<AddressTitle />)).toMatchSnapshot();
  });
});

describe('<GenerateDraftButton />', () => {
  it('should render correctly', () => {
    expect(shallow(<GenerateDraftButton />)).toMatchSnapshot();
  });
});

describe('<GenerateDraftContainer />', () => {
  it('should render correctly', () => {
    expect(shallow(<GenerateDraftContainer />)).toMatchSnapshot();
  });
});

describe('<TableWrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<TableWrapper />)).toMatchSnapshot();
  });
});

describe('<MandatoryField />', () => {
  it('should render correctly', () => {
    expect(shallow(<MandatoryField />)).toMatchSnapshot();
  });
});

describe('<LabelWrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<LabelWrapper />)).toMatchSnapshot();
  });
});

describe('<AttachmentsWrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<AttachmentsWrapper />)).toMatchSnapshot();
  });
});
