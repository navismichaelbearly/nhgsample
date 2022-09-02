import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { RadioGroup, Radio, Textarea, Typography, validate } from 'nhh-styles';

import { PageContent } from '../';
import { FieldRow, FormWrapper } from '../../components';

import connect from './connect';

export class ReferArrearsCaseComposition extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { details: '', detailsError: '', referralTeam: '', referralTeamError: '' };
  }
  componentDidMount() {
    const { getReferralTeams, updatePageHeader } = this.props;
    updatePageHeader();
    getReferralTeams();
  }

  handleBackClick = () => {
    this.resetForm();
    this.props.onBack();
  };

  handleDetailsChange = ev => {
    this.setState({
      details: ev.target.value,
      detailsError: '',
    });
  };

  handleFormSubmit = ev => {
    ev.preventDefault();
    const { referralTeams, text } = this.props;
    const { details, referralTeam } = this.state;
    const detailsValidation = validate(details, {
      errors: { default: text.detailsError },
    });

    const referralTeamValidation = validate(referralTeam, {
      errors: { default: text.referTeamError },
    });

    if (detailsValidation.didValidate && referralTeamValidation.didValidate) {
      this.props.onSubmit(
        details.trim(),
        referralTeams.filter(team => team.id === referralTeam)[0]
      );
    } else {
      this.setState({
        detailsError: detailsValidation.message,
        referralTeamError: referralTeamValidation.message,
      });
    }
  };

  handleReferralTeamChange = id => {
    this.setState({
      referralTeam: id,
      referralTeamError: '',
    });
  };

  resetForm() {
    this.setState({
      details: '',
      detailsError: '',
      referralTeam: '',
      referralTeamError: '',
    });
  }
  render() {
    const { referralTeams, text, referralError, errorMessage, isLoading } = this.props;
    const { details, detailsError, referralTeam, referralTeamError } = this.state;
    return (
      <PageContent>
        <div className="col-lg-9">
          <FormWrapper
            backButtonText={text.back}
            formName="referArrearsCase"
            handleBackClick={this.handleBackClick}
            handleFormSubmit={this.handleFormSubmit}
            submitButtonText={text.submit}
            formError={referralError ? errorMessage : null}
            loading={isLoading}
          >
            <FieldRow>
              <Typography.Label>{text.referTo}</Typography.Label>
              <RadioGroup
                error={referralTeamError}
                required
                name="referArrearsCase-referralTeamsGroup"
              >
                {referralTeams.map(({ id, name }) => (
                  <Radio
                    disabled={isLoading}
                    key={id}
                    checked={referralTeam === id}
                    data-bdd={`referArrearsCase-referralTeamsGroup-${id}`}
                    display="block"
                    id={id}
                    onChange={() => this.handleReferralTeamChange(id)}
                  >
                    {name}
                  </Radio>
                ))}
              </RadioGroup>
            </FieldRow>
            <div className="mb-md-5">
              <Textarea
                disabled={isLoading}
                labelText={text.referDetailsLabel}
                data-bdd="referArrearsCase-details"
                isFullWidth
                required
                id="details"
                value={details}
                error={detailsError}
                onChange={this.handleDetailsChange}
              />
            </div>
          </FormWrapper>
        </div>
      </PageContent>
    );
  }
}

ReferArrearsCaseComposition.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  getReferralTeams: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  referralError: PropTypes.bool.isRequired,
  referralTeams: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, name: PropTypes.string.isRequired })
  ).isRequired,
  text: PropTypes.shape({
    back: PropTypes.string.isRequired,
    detailsError: PropTypes.string.isRequired,
    heading1: PropTypes.string.isRequired,
    heading2: PropTypes.string.isRequired,
    referDetailsLabel: PropTypes.string.isRequired,
    referredFor: PropTypes.string.isRequired,
    referTeamError: PropTypes.string.isRequired,
    referTo: PropTypes.string.isRequired,
    submit: PropTypes.string.isRequired,
    successMessage: PropTypes.string.isRequired,
  }).isRequired,
  updatePageHeader: PropTypes.func.isRequired,
};

export default connect(ReferArrearsCaseComposition);
