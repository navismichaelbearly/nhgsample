import styled from 'styled-components';
import { defaultTheme } from 'nhh-styles';

// eslint-disable-next-line import/prefer-default-export
export const Wrapper = styled.div`
  table {
    font-size: 0.8em;
    td:nth-child(2) {
      text-align: right;
      button,
      button:hover {
        color: ${defaultTheme.colors.support.two} !important;
      }
    }
  }
`;
