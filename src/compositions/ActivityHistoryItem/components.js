import styled from 'styled-components';
import { Box, BoxHighlight, mediaQueries, defaultTheme } from 'nhh-styles';

export const ActivityItemWrapper = styled.div`
  margin: 30px -50px;
  min-height: 18.75rem;
  ${mediaQueries.mobile`
    margin: 0;
  `};
`;

export const CustomerDetailsContainer = styled(BoxHighlight)`
  margin: 0 0 30px 0;
`;

export const LoaderContainer = styled.div`
  min-height: 18.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Wrapper = styled(Box)`
  padding: 25px;
  margin-bottom: 30px;
`;

export const AttachmentsWrapper = styled.div`
  margin-bottom: 30px;
`;

export const ErrorMessage = styled.div`
  margin-bottom: 30px;
  color: ${defaultTheme.colors.support.two};
`;

export const TableWrapper = styled.div`
  table {
    font-size: 0.8em;
    td:nth-child(2) {
      text-align: right;
      button,
      button:hover {
        color: ${defaultTheme.colors.primary} !important;

        &.success {
          color: ${defaultTheme.colors.support.three} !important;
        }
      }
    }
  }
`;
