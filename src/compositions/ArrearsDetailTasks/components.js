import styled from 'styled-components';
import { Button, Typography } from 'nhh-styles';

export const Task = styled.div`
  padding: 1.875rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: ${props =>
    props.overdue ? props.theme.colors.support.six : props.theme.colors.secondaryLight};
  border: ${props => (props.overdue ? '1px solid red' : 'inherit')};
  &:focus {
    background-color: ${props => props.theme.colors.support.six};
  }
`;

export const TaskBody = styled.div`
  margin-bottom: 1.875rem;
`;

export const TaskDescription = styled.div`
  display: block;
  margin-top: 1.25rem;
`;

export const Label = styled.div`
  font-weight: 700;
  margin-top: 0.45rem;
  margin-bottom: 1.5rem;
`;

export const TaskLabel = styled.span`
  font-weight: 700;
  color: ${props => (props.overdue ? props.theme.colors.support.two : 'inherit')};
`;
export const TaskValue = styled.span`
  font-weight: ${props => (props.overdue ? 700 : 'inherit')};
  color: ${props => (props.overdue ? props.theme.colors.support.two : 'inherit')};
`;

export const TaskLink = styled(Button)`
  font-size: inherit;
  margin-bottom: 1.25rem;
`;

export const Wrapper = styled.div`
  clear: both;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
`;

export const H3 = styled(Typography.H3)`
  margin-bottom: 30px;
`;

export const OverdueLabel = styled.span`
  color: ${props => props.theme.colors.support.two};
  font-weight: bold;
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  > button {
    width: 170px;
    text-transform: uppercase;
  }
`;
