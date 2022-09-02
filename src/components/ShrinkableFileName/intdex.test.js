import React from 'react';
import { shallow } from 'enzyme';
import AttachmentsTableFileName from '.';

describe('<AttachmentsTableFileName />', () => {
  let el;

  beforeEach(() => {
    el = shallow(<AttachmentsTableFileName name={'Hello world'} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with a name', () => {
    expect(el).toMatchSnapshot();
  });

  it('should render a span for mobile and a span for desktop', () => {
    expect(el.find('span').length).toBe(2);
  });

  it('should shrink down the file names for desktop and for mobile', () => {
    el = shallow(
      <AttachmentsTableFileName
        name={'somecrazilybigfilenamethatshouldtriggertheshortenerfunction.jpg'}
      />
    );

    const desktopVersion = el.find('span').at(0);
    const mobileVersion = el.find('span').at(1);

    expect(desktopVersion.text()).toBe('somecrazilybigfilenamethat...ion.jpg');
    expect(mobileVersion.text()).toBe('somecra...ion.jpg');
  });
});
