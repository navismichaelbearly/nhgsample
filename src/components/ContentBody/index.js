import React from 'react';
import PropTypes from 'prop-types';

import { InnerContainer, OuterContainer } from './components';

const ContentBody = ({ children }) => (
  <OuterContainer className="container-fluid">
    <InnerContainer className="container">{children}</InnerContainer>
  </OuterContainer>
);

ContentBody.defaultProps = {
  children: null,
};

ContentBody.propTypes = {
  children: PropTypes.node,
};

export default ContentBody;
