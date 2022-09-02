import styled from 'styled-components';
import { mediaQueries } from 'nhh-styles';

export default styled.div`
  ${({ isCenter }) =>
    isCenter &&
    `
    text-align: center
  `} > button {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  ${mediaQueries.desktop`
    display: flex;
    justify-content: center;
    > button {
      width: 49%;
      & + button {
        margin-left: 10%;
      }
    }
  `};
`;
