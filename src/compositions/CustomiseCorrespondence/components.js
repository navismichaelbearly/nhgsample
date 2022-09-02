import { Button, Typography, defaultTheme } from 'nhh-styles';
import styled from 'styled-components';

export const AddressTitle = styled(Typography.H4)`
  margin-bottom: 1.875rem;
`;

export const GenerateDraftButton = styled(Button)`
  height: 3.75rem;
  min-width: 12.5rem;
`;

export const GenerateDraftContainer = styled.div`
  margin: 0 auto;
  text-align: center;
  margin-bottom: 1.875rem;
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

export const MandatoryField = styled.div`
  color: rgba(0, 0, 0, 0.3);
  text-decoration: underline;
`;

export const LabelWrapper = styled.span`
  white-space: nowrap;
`;

export const AttachmentsWrapper = styled.div`
  margin-bottom: 30px;
`;

export const ErrorText = styled.div`
  color: ${defaultTheme.colors.support.two};
  margin-bottom: 40px;
`;
