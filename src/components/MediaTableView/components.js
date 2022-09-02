import styled from 'styled-components';
import { defaultTheme } from 'nhh-styles';

export const SuccessWrapper = styled.div`
  padding: 10px;
  color: ${defaultTheme.colors.support.three};
`;

export const ErrorWrapper = styled.div`
  button + button {
    margin-left: 20px;
  }
`;

export const ErrorText = styled.div`
  color ${defaultTheme.colors.support.two};
`;

export const LabelWrapper = styled.span`
  white-space: nowrap;
`;

export const TableWrapper = styled.div`
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
