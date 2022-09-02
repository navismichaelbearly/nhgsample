import styled, { withTheme } from 'styled-components';

// eslint-disable-next-line
export const Flag = withTheme(styled.span`
  color: ${({ theme }) => theme.colors.support.two};
  font-weight: 700;
`);
