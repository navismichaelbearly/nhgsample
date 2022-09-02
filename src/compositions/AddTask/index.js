import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NotificationPanel } from 'nhh-styles';
import { PageContent, PropertyInformation } from '../';
import AddTaskForm from './AddTaskForm';
import { NotificationWrapper } from '../../components/Common';
import { CustomerDetailsContainer, FormContainer, Wrapper } from './components';

import connect from './connect';

export class AddTaskComposition extends PureComponent {
  constructor(props) {
    super(props);
    if (props.removeNotification) props.removeNotification();
  }
  componentDidMount() {
    const { updatePageHeader } = this.props;
    updatePageHeader();
  }

  componentWillUnmount() {
    this.props.onUnmount();
  }

  render() {
    return (
      <PageContent>
        <div className="col-lg-9">
          <Wrapper>
            <CustomerDetailsContainer>
              <PropertyInformation />
            </CustomerDetailsContainer>
            <FormContainer>
              {!!this.props.error && (
                <NotificationWrapper data-bdd="AddNote-error">
                  <NotificationPanel
                    icon="warning"
                    description={this.props.errorMessage}
                    hideCloseButton
                    show
                  />
                </NotificationWrapper>
              )}
              <AddTaskForm {...this.props} />
            </FormContainer>
          </Wrapper>
        </div>
      </PageContent>
    );
  }
}

AddTaskComposition.propTypes = {
  error: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  onUnmount: PropTypes.func.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  removeNotification: PropTypes.func,
};

AddTaskComposition.defaultProps = {
  removeNotification: () => {},
};

export default connect(AddTaskComposition);
