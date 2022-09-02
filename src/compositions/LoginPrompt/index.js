import React, { Component } from 'react';
import { LoginPromptContainer } from 'nhh-styles';
import PropTypes from 'prop-types';

import connect from './connect';

export class LoginPromptComposition extends Component {
  constructor(props) {
    super(props);
    this.isLoggedIn(props);
  }

  componentDidMount() {
    this.props.displayLogin();
  }

  componentWillReceiveProps(newProps) {
    this.isLoggedIn(newProps);
  }

  isLoggedIn = props => {
    const { entryPoint, history, user } = props;

    // check if is already logged in
    if (user.loggedIn) {
      history.push(entryPoint !== '/login' ? entryPoint : '/');
    }
  };

  render() {
    return <LoginPromptContainer />;
  }
}

LoginPromptComposition.defaultProps = {
  entryPoint: '/',
  please: '',
  title: '',
};

LoginPromptComposition.propTypes = {
  displayLogin: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  user: PropTypes.shape({
    loggedIn: PropTypes.bool.isRequired,
    profile: PropTypes.object.isRequired,
  }).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  entryPoint: PropTypes.string,
};

export default connect(LoginPromptComposition);
