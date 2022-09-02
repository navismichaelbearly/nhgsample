import styled, { withTheme } from 'styled-components';
import { Typography } from 'nhh-styles';

export const HighlightedSection = withTheme(styled.section`
  color: ${({ theme }) => theme.colors.support.two};
  margin-top: 5px;
`);

export const HighlightedTitle = Typography.P.extend`
  font-weight: 700;
  margin-bottom: 0;
`;

export const HighlightedAmount = styled.p`
  font-size: 37px;
  font-weight: 700;
  margin-bottom: 0;
`;

export const Seperator = styled.div`
  background-color: #e1e1e1;
  margin: 20px 0;
  height: 1px;
`;

export const UnderLinedText = styled.p`
  text-decoration: underline;
  font-size: 0.8125rem;
  font-weight: 700;
  margin-bottom: 0;
`;

export const StatsContainer = styled.ul`
  line-height: normal;
  padding-left: 20px;
`;
