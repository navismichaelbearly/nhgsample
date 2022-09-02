/* eslint-disable */
/**
 * file to aggregate styled components and make them more re-useable (potentially)
 * eg we need to replace the labels that are used as headings
 * so we creat the replacements here
 */

import { Typography, BoxHighlight } from 'nhh-styles';
import styled from 'styled-components';

const { Label, LightP, Footnote, P, H4, UpperCaseLabel } = Typography;
const Heading = Label.withComponent('h2');
const Heading3 = Label.withComponent('h3');
const Wrapper = LightP.withComponent('div');
const Bold = styled.b`
  font-weight: 600;
`;

// Most of the headings are h4 when they should be h2
const H2AsH4 = H4.withComponent('h2');
const UpperH3 = UpperCaseLabel.withComponent('h3');


const InLineLightP = LightP.extend`
  margin: ${props => props.margin};
  display: inline-block;
`;

InLineLightP.defaultProps = {
  margin: '0 0 0 3px',
};

// export LightP as well to keep it in one place
export {
  Wrapper,
  Heading,
  Heading3,
  UpperH3,
  LightP,
  P,
  BoxHighlight,
  H2AsH4,
  Footnote,
  Bold,
  UpperCaseLabel,
  Label,
  InLineLightP,
};
