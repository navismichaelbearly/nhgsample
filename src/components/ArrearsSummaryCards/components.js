import styled from 'styled-components';
import { mediaQueries } from 'nhh-styles';

// eslint-disable-next-line import/prefer-default-export
export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 12px;

  > a {
    color: inherit;
    margin-bottom: 16px;
    margin-right: 1%;
    width: 32%;

    &:hover {
      color: inherit;
      text-decoration: none;
    }

    ${mediaQueries.mobile`
      margin-right: 0;
      width: 100%;
    `};

    ${mediaQueries.tablet`
      width: 49%;
    `};
  }
`;
