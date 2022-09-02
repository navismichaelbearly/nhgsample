import React, { PureComponent } from 'react';
import { Button, NotificationPanel, Textarea, Typography, Select, Loader } from 'nhh-styles';
import PropTypes from 'prop-types';
import connect from './connect';
import { ButtonRow, FieldRow } from '../../components';

const dataBddPrefix = 'closePaymentPlan';
const initialState = {
  note: '',
  selectError: '',
};

export class ClosePaymentPlanCompositions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  onClose = () => {
    const { onClose } = this.props;
    this.setState({ selectError: '' });
    if (!this.state.reason) {
      this.setState({ selectError: this.props.errorText.closePlanSelectRequired });
      return;
    }
    onClose({
      terminationReason: this.state.reason,
      note: this.state.note,
    });
  };

  resetError(field) {
    if (field === 'reason') {
      this.setState({ selectError: '' });
    }
    return null;
  }

  handleFieldChange = (field, value) => {
    this.setState(
      {
        [field]: value,
      },
      this.resetError(field)
    );
  };

  render() {
    const {
      heading,
      labels: {
        closePlanDisclaimer,
        closePlanDescription,
        closePlanNo,
        closePlanYes,
        newArrangementOption,
        pleaseSelectAReason,
        reasonSelect,
        reasonText,
        tenantDefaultOption,
      },
      isLoading,
      onCancel,
    } = this.props;
    const { reason, note } = this.state;
    return (
      <React.Fragment>
        <Typography.H3>{heading}</Typography.H3>
        <Typography.P>{closePlanDescription}</Typography.P>
        <FieldRow>
          <NotificationPanel
            data-bdd={`${dataBddPrefix}-disclaimer`}
            hideCloseButton
            icon="warning"
            show
            description={closePlanDisclaimer}
          />
        </FieldRow>
        <FieldRow>
          <Select
            disabled={isLoading}
            isFullWidth
            labelText={reasonSelect}
            required
            items={[tenantDefaultOption, newArrangementOption]}
            id="reason"
            onSelect={item => this.handleFieldChange('reason', item)}
            value={reason}
            defaultInputValue={pleaseSelectAReason}
            error={this.state.selectError}
            data-bdd={`${dataBddPrefix}-select-reason`}
          />
        </FieldRow>
        <FieldRow>
          <Textarea
            disabled={isLoading}
            isFullWidth
            labelText={reasonText}
            id="note"
            onChange={ev => this.handleFieldChange('note', ev.target.value)}
            value={note}
            data-bdd={`${dataBddPrefix}-note`}
          />
        </FieldRow>
        {isLoading ? (
          <Loader />
        ) : (
          <ButtonRow>
            <Button
              data-bdd={`${dataBddPrefix}-no`}
              onClick={onCancel}
              isFullWidth
              buttonType="secondary"
            >
              {closePlanNo}
            </Button>
            <Button data-bdd={`${dataBddPrefix}-yes`} onClick={this.onClose} isFullWidth>
              {closePlanYes}
            </Button>
          </ButtonRow>
        )}
      </React.Fragment>
    );
  }
}

ClosePaymentPlanCompositions.propTypes = {
  errorText: PropTypes.shape({
    closePlanSelectRequired: PropTypes.string.isRequired,
  }).isRequired,
  heading: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  labels: PropTypes.shape({
    closePlanDescription: PropTypes.string.isRequired,
    closePlanDisclaimer: PropTypes.string.isRequired,
    closePlanNo: PropTypes.string.isRequired,
    closePlanYes: PropTypes.string.isRequired,
    newArrangementOption: PropTypes.string.isRequired,
    pleaseSelectAReason: PropTypes.string.isRequired,
    reasonSelect: PropTypes.string.isRequired,
    reasonText: PropTypes.string.isRequired,
    tenantDefaultOption: PropTypes.string.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connect(ClosePaymentPlanCompositions);
