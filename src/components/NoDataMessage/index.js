import React from 'react';
import { icons, PaddedBox, Typography } from 'nhh-styles';
import PropTypes from 'prop-types';

import { IconContainer, TextContainer } from './components';

const NoDataMessage = ({ message }) => (
  <PaddedBox>
    <IconContainer>{icons.money}</IconContainer>
    <TextContainer>
      <Typography.H3>{message}</Typography.H3>
    </TextContainer>
  </PaddedBox>
);

NoDataMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default NoDataMessage;
