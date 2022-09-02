import styled from 'styled-components';

export const DateTimeContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const WarningContainer = styled.div`
  color: ${({ theme }) => theme.colors.primaryLight};
  padding-bottom: 10px;
  padding-left: 8px;
`;
