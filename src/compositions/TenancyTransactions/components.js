import styled from 'styled-components';
import { Typography } from 'nhh-styles';

export const H3 = styled(Typography.H3)`
  margin-bottom: 1.5rem;
`;

export const P = styled(Typography.P)`
  margin-bottom: 1.5rem;
`;

export const Wrapper = styled.div`
  margin-bottom: 1.5rem;
  &:last-child {
    margin-bottom: 1.875rem;
  }
`;
