import styled from 'styled-components';
import { Button, mediaQueries, Typography } from 'nhh-styles';

/**
 * file to aggregate styled components and hopefully allow more reuse of them
 * also to eventually replace all the labels used as heading etc
 */
export const Heading = styled(Typography.H3)`
  margin-bottom: 1.5rem;
`;

export const Label = styled.span`
  font-weight: 700;
  ${mediaQueries.desktop`
    white-space: nowrap;
  `};
  ${mediaQueries.tablet`
    white-space: nowrap;
  `};
`;

export const LabelLink = styled(Button)`
  font-weight: 700;
  font-size: 18px;
  padding: 0;
  text-align: left;
`;

export const Wrapper = styled.div`
  margin-bottom: 1.5rem;
`;

export const NotificationWrapper = styled.div`
  margin-bottom: 30px;
`;
