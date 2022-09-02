import styled from 'styled-components';
import { Typography } from 'nhh-styles';

export const Section = styled.section`
  margin-bottom: 1.875rem;
`;

export const SectionTitle = styled(Typography.H4)`
  margin-bottom: 0;
`;

export const TextBlock = styled(Typography.P)`
  margin-bottom: 0.3125rem;

  span {
    display: block;
  }
`;
