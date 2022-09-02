import React from 'react';
import { shallow } from 'enzyme';

import {
  Task,
  TaskBody,
  TaskDescription,
  TaskLabel,
  Label,
  TaskValue,
  TaskLink,
  Wrapper,
  H3,
  OverdueLabel,
  ButtonsWrapper,
} from './components';

const props = {
  theme: {
    colors: {
      secondaryLight: 'grey',
      support: { two: 'red', one: 'blue', six: 'yellow' },
    },
  },
};

describe('<Task />', () => {
  it('should render correctly', () => {
    expect(shallow(<Task {...props} />)).toMatchSnapshot();
  });
});

describe('<TaskBody />', () => {
  it('should render correctly', () => {
    expect(shallow(<TaskBody {...props} />)).toMatchSnapshot();
  });
});

describe('<TaskDescription />', () => {
  it('should render correctly', () => {
    expect(shallow(<TaskDescription {...props} />)).toMatchSnapshot();
  });
});

describe('<TaskLink />', () => {
  it('should render correctly', () => {
    expect(shallow(<TaskLink {...props} />)).toMatchSnapshot();
  });
});

describe('<H3 />', () => {
  it('should render correctly', () => {
    expect(shallow(<H3 />)).toMatchSnapshot();
  });
});

describe('<OverdueLabel />', () => {
  it('should render correctly', () => {
    expect(shallow(<OverdueLabel {...props} />)).toMatchSnapshot();
  });
});

describe('<ButtonsWrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<ButtonsWrapper {...props} />)).toMatchSnapshot();
  });
});

describe('<TaskLabel />', () => {
  it('should render correctly', () => {
    expect(shallow(<TaskLabel {...props} />)).toMatchSnapshot();
  });
});

describe('<Label />', () => {
  it('should render correctly', () => {
    expect(shallow(<Label {...props} />)).toMatchSnapshot();
  });
});

describe('<TaskValue />', () => {
  it('should render correctly', () => {
    expect(shallow(<TaskValue {...props} />)).toMatchSnapshot();
  });
});

describe('<Wrapper />', () => {
  it('should render correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
});
