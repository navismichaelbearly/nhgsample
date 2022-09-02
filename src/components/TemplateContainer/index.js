import { mediaQueries } from 'nhh-styles';
import styled from 'styled-components';

export default styled.div`
  width: auto;
  ${mediaQueries.desktop`
    width: 50rem;
  `};
`;
