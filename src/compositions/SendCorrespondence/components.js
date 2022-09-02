import styled from 'styled-components';

export const ButtonRow = styled.div`
  text-align: center;
  > button {
    width: 50%;
    min-width: 150px;
    margin-bottom: 50px;
  }
`;

export const Img = styled.img`
  max-width: 1730px;
  width: 100%;
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => (theme ? theme.colors.support.two : 'inherit')};
  margin-bottom: 50px;
`;
