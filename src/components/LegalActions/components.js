import styled, { withTheme } from 'styled-components';
import { Typography } from 'nhh-styles';

export const Wrapper = styled.div`
  margin: 1.5rem 0 1.875rem 0;
`;

export const P = styled(Typography.P)`
  margin: 1rem 0;
`;

export const Label = styled.span`
  font-weight: 700;
`;

export const Highlight = withTheme(styled.span`
  color: ${({ theme, isExpiring }) => (isExpiring ? theme.colors.support.two : 'inherit')};
  ${({ isExpiring }) => isExpiring && `font-weight: 700;`};
`);
