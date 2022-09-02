import styled from 'styled-components';
import { Button, mediaQueries, Typography } from 'nhh-styles';

export const H3 = styled(Typography.H3)`
  margin-bottom: 30px;
`;

export const Link = styled(Button)`
  font-size: inherit;
  font-weight: 400;
  display: inline;
`;

export const Container = styled.section`
  padding: 25px 28px 0;

  ${mediaQueries.mobile`
    padding: 15px 18px;
  `};
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => (theme ? theme.colors.support.two : 'inherit')};
  margin-bottom: 50px;
`;

export const DateField = styled.div``;

export const Row = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.tertiaryLighter};
  color: ${({ theme }) => theme.colors.tertiary};
  display: flex;
  flex-direction: row;
  font-size: 16px;
  padding: 8px 0;
`;

export const Header = Row.extend`
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const Column = styled.div`
  width: ${({ width }) => width || 'auto'};
  text-align: ${({ align }) => align || 'left'};
  padding-right: 8px;
  word-wrap: break-word;

  &:last-child {
    padding-right: 0;
  }

  ${mediaQueries.mobile`
    padding-right: 4px;
  `};
`;

export const DesktopView = styled.div`
  display: none;

  ${mediaQueries.desktop`
    display: block;
  `};
`;

export const MobileAndTabletView = styled.div`
  display: block;

  ${mediaQueries.desktop`
    display: none;
  `};
`;
