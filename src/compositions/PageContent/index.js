import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Container, HelmetWithFavIcons, Loader, Ribbon } from 'nhh-styles';

import { ContentBody, ErrorBoundary as EB } from '../../components';
import { ArrearsNotifications } from '../';
import connect from './connect';

export class PageContentComposition extends PureComponent {
  componentDidMount() {
    if (!this.props.ignoreArrearFetch) this.props.getArrearsDetail();
  }

  render() {
    const { children, ribbon, heading, loading, errorMessage } = this.props;
    return loading ? (
      <Loader />
    ) : (
      <Container>
        <EB messageOnScreen={errorMessage}>
          <HelmetWithFavIcons>
            <title>{ribbon.title || heading}</title>
          </HelmetWithFavIcons>
          <Ribbon outerClass="container-fluid" innerClass="container header" {...ribbon} />
          <ContentBody>
            <EB>
              <ArrearsNotifications />
            </EB>
            <EB>
              <div className="row">{children}</div>
            </EB>
          </ContentBody>
        </EB>
      </Container>
    );
  }
}

PageContentComposition.defaultProps = {
  children: null,
  heading: '',
  ribbon: { title: '' },
  loading: false,
  ignoreArrearFetch: false,
};

PageContentComposition.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  getArrearsDetail: PropTypes.func.isRequired,
  children: PropTypes.node,
  heading: PropTypes.string,
  ignoreArrearFetch: PropTypes.bool,
  loading: PropTypes.bool,
  ribbon: PropTypes.shape(Ribbon.propTypes),
};

export default withRouter(connect(PageContentComposition));
