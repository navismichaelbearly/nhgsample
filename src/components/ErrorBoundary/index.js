import React from 'react';
import PropTypes from 'prop-types';

import Heading from './component';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return this.props.messageOnScreen ? <Heading>{this.props.messageOnScreen}</Heading> : null;
    }
    return this.props.children;
  }
}
ErrorBoundary.defaultProps = {
  messageOnScreen: null,
};
ErrorBoundary.propTypes = {
  children: PropTypes.any.isRequired,
  messageOnScreen: PropTypes.string,
};

export default ErrorBoundary;
