import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'nhh-styles';
import { withRouter } from 'react-router';
import PageContent from '../PageContent';
import connect from './connect';
import { Wrapper } from './components';
import { getArrearsDetailRoute } from '../../constants/internalRoutes';

import ArrearsDetailTasks from '../ArrearsDetailTasks';

export class ArchivedTasksComposition extends PureComponent {
  componentDidMount() {
    this.props.updatePageHeader();
  }

  render() {
    const { arrearsId, arrearsDetailHeading } = this.props;
    const arrearsDetailLink = getArrearsDetailRoute(arrearsId);
    return (
      <PageContent ignoreArrearFetch>
        <div className="col-lg-9">
          <Wrapper>
            <ArrearsDetailTasks archived />
          </Wrapper>
        </div>
        <aside className="col-lg-3">
          <Button
            data-bdd={`ArchivedTasks-arrearsDetailLink`}
            to={arrearsDetailLink || null}
            href={arrearsDetailLink || null}
            isFullWidth
          >
            {arrearsDetailHeading}
          </Button>
        </aside>
      </PageContent>
    );
  }
}

ArchivedTasksComposition.propTypes = {
  arrearsDetailHeading: PropTypes.string.isRequired,
  arrearsId: PropTypes.string.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
};

export default withRouter(connect(ArchivedTasksComposition));
