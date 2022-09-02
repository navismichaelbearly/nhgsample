import { Typography } from 'nhh-styles';
import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import PreviewTemplate from './';
import { Img } from './components';
import { BASE64IMAGE, TEXT, HTML } from '../../constants/previewTemplateTypes';

const defaultProps = {
  content: '',
  onClose: () => {},
  dataBddPrefix: 'dataBdd',
  errorMessage: 'No template found, please contact your IT help desk',
  label: 'Select correspondence template',
  type: '',
};

const render = props => shallow(<PreviewTemplate {...defaultProps} {...props} />);

describe('PreviewTemplate', () => {
  it('should render an error when no content is specified', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render an image element when type is image', () => {
    const wrapper = render({ content: 'base64image', type: BASE64IMAGE });
    expect(wrapper.find(Img).exists()).toBe(true);
  });

  it('should render an paragraph element when type is text', () => {
    const wrapper = render({ content: 'some text', type: TEXT });
    expect(wrapper.find(Typography.P).exists()).toBe(true);
  });

  it('should render a div with dangerouslySetInnerHTML attribute when type is html', () => {
    const wrapper = render({ content: '<p>this is some html</p>', type: HTML });
    expect(wrapper).toMatchSnapshot();
  });
});
