import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { DateInput, Input, Loader, RadioGroup, Radio, Select, Typography } from 'nhh-styles';
import startOfDay from 'date-fns/start_of_day';

import connect from './connect';
import { FieldRow, FormWrapper } from '../../components';
import { PageContent } from '../';
import { Row } from './components';

const initialState = {
  isDirty: {},
};

export class WelfareReformDetailsComposition extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
      ...props.welfareReform,
      universalCredit: props.welfareReform.universalCredit || false,
      benefitCap: props.welfareReform.benefitCap || false,
      bedroomTax: props.welfareReform.bedroomTax || false,
      claimStartDate: props.welfareReform.claimStartDate || null,
      paymentDay: props.welfareReform.paymentDay || null,
      apaStatus: props.welfareReform.apaStatusDescription || null,
      ucArrearsPaymentStatus: props.welfareReform.ucArrearsPaymentStatusDescription || null,
    };
  }

  componentDidMount() {
    const { updatePageHeader } = this.props;
    this.resetForm();
    updatePageHeader();
    this.props.getWelfareReformDetails();
    this.props.getOptionSets();
  }

  componentDidUpdate(prevProps) {
    if (this.props.tenancyId !== prevProps.tenancyId) {
      this.props.getOptionSets();
      this.props.getWelfareReformDetails();
    }
    if (this.props.welfareReform !== prevProps.welfareReform) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        universalCredit: this.props.welfareReform.universalCredit,
        claimStartDate: this.props.welfareReform.claimStartDate,
        paymentDay: this.props.welfareReform.paymentDay,
        benefitCap: this.props.welfareReform.benefitCap,
        bedroomTax: this.props.welfareReform.bedroomTax,
        apaStatus: this.props.welfareReform.apaStatusDescription,
        ucArrearsPaymentStatus: this.props.welfareReform.ucArrearsPaymentStatusDescription,
      });
    }
  }

  handleBackClick = () => {
    this.resetForm();
    this.props.onBack();
  };

  handleFieldChange = ev => {
    if (ev.preventDefault) ev.preventDefault();
    const cloneState = { ...this.state };
    this.setState({
      [ev.target.id]: ev.target.value,
      isDirty: {
        ...cloneState.isDirty,
        [ev.target.id]: ev.target.value,
      },
    });
  };

  handleFormSubmit = ev => {
    ev.preventDefault();
    const { onSubmit } = this.props;
    const {
      universalCredit,
      claimStartDate,
      paymentDay,
      benefitCap,
      bedroomTax,
      apaStatusSelected,
      ucArrearsPaymentStatusSelected,
    } = this.state;
    this.setState(
      {
        isDirty: {
          claimStartDate: null,
          apaStatus: null,
          ucArrearsPaymentStatus: null,
        },
      },
      () => {
        onSubmit({
          universalCredit,
          claimStartDate: claimStartDate || null,
          paymentDay: paymentDay || null,
          benefitCap,
          bedroomTax,
          alternativePaymentArrangementStatusId: apaStatusSelected ? apaStatusSelected.id : null,
          ucArrearsPaymentStatusId: ucArrearsPaymentStatusSelected
            ? ucArrearsPaymentStatusSelected.id
            : null,
        });
        this.resetForm();
      }
    );
  };

  resetForm = () => {
    this.setState({ ...initialState });
  };

  universalCreditChange = () => {
    this.setState(prevState => ({
      universalCredit: !prevState.universalCredit,
    }));
  };
  bedroomTaxChange = () => {
    this.setState(prevState => ({
      bedroomTax: !prevState.bedroomTax,
    }));
  };
  benefitCapChange = () => {
    this.setState(prevState => ({
      benefitCap: !prevState.benefitCap,
    }));
  };
  updateInputState = e => {
    const val = e.currentTarget.value;
    this.setState({
      paymentDay: val,
    });
    if (val && (val > 31 || val < 1)) {
      this.setState({
        paymentDayError: this.props.paymentDayError,
        isFormDisabled: true,
      });
    } else if (this.props.welfareReform.paymentDay && val === '') {
      this.setState({
        paymentDayError: this.props.paymentDayError,
        isFormDisabled: true,
      });
    } else
      this.setState({
        paymentDayError: '',
        isFormDisabled: false,
      });
  };

  handleKeyDown = e => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    if (/\+|-/.test(keyValue)) {
      e.preventDefault();
    }
  };

  render() {
    const {
      labels: { backButton, saveButton },
      loading,
      apaStatuses,
      ucArrearsPaymentStatuses,
      welfareReform,
    } = this.props;
    const {
      universalCredit,
      bedroomTax,
      benefitCap,
      claimStartDate,
      paymentDay,
      apaStatus,
      ucArrearsPaymentStatus,
    } = this.state;
    const defaultDate = claimStartDate ? new Date(claimStartDate) : null;
    const defaultApaStatus = apaStatus || '';
    const defaultUCArrearsPaymentStatus = ucArrearsPaymentStatus || '';
    return (
      <PageContent>
        {loading ? (
          <Loader />
        ) : (
          <div className="col-lg-9">
            <FormWrapper
              backButtonText={backButton}
              disableSubmit={this.state.isFormDisabled}
              formName="welfareReformDetails"
              handleBackClick={this.handleBackClick}
              handleFormSubmit={this.handleFormSubmit}
              submitButtonText={saveButton}
              hidePropertyInformation={this.props.hidePropertyInfo}
            >
              {welfareReform && (
                <div>
                  <Typography.H3>Welfare reform details</Typography.H3>
                  <FieldRow data-bdd="universalCredit">
                    <Typography.Label>Universal Credit</Typography.Label>
                    <RadioGroup>
                      <Radio checked={universalCredit} onChange={this.universalCreditChange}>
                        Yes
                      </Radio>
                      <Radio checked={!universalCredit} onChange={this.universalCreditChange}>
                        No
                      </Radio>
                    </RadioGroup>
                  </FieldRow>
                  {universalCredit && (
                    <Fragment>
                      <Typography.Label data-bdd="claimStartDate-label">
                        Claim start date
                      </Typography.Label>
                      <FieldRow data-bdd="claimStartDate-selectDate">
                        <Row>
                          <DateInput
                            isFullWidth
                            minDate={startOfDay(new Date(2013, 3, 1, 12, 0, 0))}
                            onDateSelected={(value, formatted) =>
                              this.handleFieldChange({
                                target: { id: 'claimStartDate', value: formatted },
                              })
                            }
                            defaultDate={defaultDate}
                          />
                        </Row>
                      </FieldRow>

                      <FieldRow>
                        <Row>
                          <Input
                            isFullWidth
                            data-bdd="paymentday"
                            id="paymentday"
                            onChange={this.updateInputState}
                            onKeyDown={this.handleKeyDown}
                            type="number"
                            value={paymentDay}
                            labelText="Payment day"
                            error={this.state.paymentDayError}
                          />
                        </Row>
                      </FieldRow>

                      <FieldRow>
                        <Row>
                          <Select
                            isFullWidth
                            dataBdd="apaStatus"
                            items={apaStatuses}
                            itemToString={item => (item ? item.label : '')}
                            labelText="APA status"
                            onChange={value =>
                              this.handleFieldChange({
                                target: { id: 'apaStatusSelected', value },
                              })
                            }
                            defaultInputValue={defaultApaStatus}
                          />
                        </Row>
                      </FieldRow>

                      <FieldRow>
                        <Row>
                          <Select
                            isFullWidth
                            dataBdd="ucArrearsPaymentStatus"
                            items={ucArrearsPaymentStatuses}
                            itemToString={item => (item ? item.label : '')}
                            labelText="UC arrears payment status"
                            onChange={value =>
                              this.handleFieldChange({
                                target: { id: 'ucArrearsPaymentStatusSelected', value },
                              })
                            }
                            defaultInputValue={defaultUCArrearsPaymentStatus}
                          />
                        </Row>
                      </FieldRow>
                    </Fragment>
                  )}
                  <FieldRow data-bdd="benefitCap">
                    <Typography.Label>Benefit cap</Typography.Label>
                    <RadioGroup>
                      <Radio checked={benefitCap} onChange={this.benefitCapChange}>
                        Yes
                      </Radio>
                      <Radio checked={!benefitCap} onChange={this.benefitCapChange}>
                        No
                      </Radio>
                    </RadioGroup>
                  </FieldRow>

                  <FieldRow data-bdd="bedroomTax">
                    <Typography.Label>Bedroom tax</Typography.Label>
                    <RadioGroup>
                      <Radio checked={bedroomTax} onChange={this.bedroomTaxChange}>
                        Yes
                      </Radio>
                      <Radio checked={!bedroomTax} onChange={this.bedroomTaxChange}>
                        No
                      </Radio>
                    </RadioGroup>
                  </FieldRow>
                </div>
              )}
            </FormWrapper>
          </div>
        )}
      </PageContent>
    );
  }
}

WelfareReformDetailsComposition.defaultProps = {
  apaStatuses: [],
  loading: false,
  hidePropertyInfo: false,
  paymentDayError: '',
  tenancyId: '',
  ucArrearsPaymentStatuses: [],
  welfareReform: {},
};

WelfareReformDetailsComposition.propTypes = {
  getOptionSets: PropTypes.func.isRequired,
  getWelfareReformDetails: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    backButton: PropTypes.string.isRequired,
    saveButton: PropTypes.string.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  apaStatuses: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  hidePropertyInfo: PropTypes.bool,
  loading: PropTypes.bool,
  paymentDayError: PropTypes.string,
  tenancyId: PropTypes.string,
  ucArrearsPaymentStatuses: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  welfareReform: PropTypes.object,
};

export default connect(WelfareReformDetailsComposition);
