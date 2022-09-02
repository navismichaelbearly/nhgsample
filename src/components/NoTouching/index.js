import React, { Component } from 'react';

export default class NoTouching extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div {...this.props} />;
  }
}
