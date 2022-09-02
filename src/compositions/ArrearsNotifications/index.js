import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import { generateId, NotificationPanel, Typography } from 'nhh-styles';
import connect from './connect';
import Container from './components';

export class ArrearsNotifications extends PureComponent {
  render() {
    const { notifications } = this.props;
    return (
      <Fragment>
        {notifications.map(({ dataBddPrefix, hideCloseButton, icon, lines, title }) => (
          <Container key={generateId()} data-bdd={dataBddPrefix}>
            <NotificationPanel
              hideCloseButton={hideCloseButton}
              icon={icon || 'warning'}
              show
              title={title}
            >
              <Fragment>
                {(lines || []).map(line => (
                  <Typography.P key={line.dataBdd || line.text}>
                    <span data-bdd={line.dataBdd && `${dataBddPrefix}-${line.dataBdd}`}>
                      {line.text}
                    </span>
                  </Typography.P>
                ))}
              </Fragment>
            </NotificationPanel>
          </Container>
        ))}
      </Fragment>
    );
  }
}

ArrearsNotifications.defaultProps = {
  notifications: [],
};

ArrearsNotifications.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      dataBddPrefix: PropTypes.string,
      hideCloseButton: PropTypes.bool,
      icon: PropTypes.string,
      lines: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          dataBdd: PropTypes.string,
        })
      ),
      title: PropTypes.string,
    })
  ),
};

export default connect(ArrearsNotifications);
