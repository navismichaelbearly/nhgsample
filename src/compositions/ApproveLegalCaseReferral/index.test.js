import React from 'react';
import { shallow } from 'enzyme';

import { ApproveLegalCaseReferralComposition } from './';

describe('<ApproveLegalCaseReferralComposition />', () => {
  let preventDefault;
  let props;
  let el;

  beforeEach(() => {
    preventDefault = jest.fn();

    props = {
      downloadFile: yo => yo,
      errorText: {
        approveReferralError: 'approveReferralError',
        formError: 'formError',
        reasonForDenyingError: 'reasonForDenyingError',
      },
      getLegalReferral: jest.fn(),
      heading: 'heading',
      labels: {
        approveReferral: 'approveReferral',
        approveReferralSubtitle: 'approveReferralSubtitle',
        backButton: 'backButton',
        no: 'no',
        reasonForDenying: 'reasonForDenying',
        referralFormLink: 'referralFormLink',
        referralPackLink: 'referralPackLink',
        submitButton: 'submitButton',
        yes: 'yes',
      },
      onBack: jest.fn(),
      onSubmit: jest.fn(),
      referralPack: {
        legalReferralForm: {
          link: 'legalReferralForm/link',
          status: 'Success',
        },
        legalReferralPack: {
          link: 'legalReferralPack/link',
          status: 'Success',
        },
      },
      requiresNonCreatorApproval: 'requiresNonCreatorApprovalSample',
      subtitle: 'subtitle',
      updatePageHeader: jest.fn(),
    };

    el = shallow(<ApproveLegalCaseReferralComposition {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the page correctly', () => {
    el.setProps({ showReadOnlyView: true });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly while loading', () => {
    el.setProps({ loading: true });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly for a housing manager', () => {
    el.setProps({ showReadOnlyView: false });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly if legal referral is mine', () => {
    el.setProps({
      showReadOnlyView: true,
      showReadOnlyViewNotification: true,
    });
    expect(el).toMatchSnapshot();
  });

  it('should update the header', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  describe('Form interaction', () => {
    it('should render the page correctly when hasClickedReferralForm is true', () => {
      el.setState({ hasClickedReferralForm: true });
      expect(el).toMatchSnapshot();
    });

    it('should render the page correctly when hasClickedReferralPack is true', () => {
      el.setState({ hasClickedReferralPack: true });
      expect(el).toMatchSnapshot();
    });

    it('should render the page correctly when all submit conditions are met', () => {
      el.setState({ hasClickedReferralForm: true, hasClickedReferralPack: true });
      expect(el).toMatchSnapshot();
    });

    it('should display reason field if approval is no', () => {
      el.setState({ approveReferral: 'no' });
      el.update();
      expect(el.find('Textarea')).toExist();
      expect(el).toMatchSnapshot();
    });

    it('should not display reason field if approval is yes', () => {
      el.setState({ approveReferral: 'yes' });
      el.update();
      expect(el.find('Textarea')).not.toExist();
      expect(el).toMatchSnapshot();
    });

    it('should reset the form and call onBack when handleBackClick fires', () => {
      el.setState({ approveReferral: 'no' });
      el.find('FormWrapper').props().handleBackClick();
      el.update();
      expect(el.find('Textarea')).not.toExist();
      expect(props.onBack).toHaveBeenCalled();
      expect(el).toMatchSnapshot();
    });

    it('should not validate the reasonForDenying field if approveReferral === yes', () => {
      el.setState({ approveReferral: 'yes' });
      el.find('[data-bdd="approveReferral-radioGroup-yes"]').props().onChange();
      el.update();
      expect(el).toMatchSnapshot();
      expect(el.state()).toMatchSnapshot();
    });

    it('should not validate the reasonForDenying field if approveReferral === no and reason field is clean', () => {
      el.find('[data-bdd="approveReferral-radioGroup-no"]').props().onChange();
      el.update();
      expect(el).toMatchSnapshot();
      expect(el.state()).toMatchSnapshot();
    });

    it('should validate the reasonForDenying field if approveReferral === no and reason field is dirty', () => {
      el.setState({ isDirty: { reasonForDenying: true } });
      el.find('[data-bdd="approveReferral-radioGroup-no"]').props().onChange();
      el.update();
      expect(el.find('Textarea').props().error).toBe('reasonForDenyingError');
      expect(el).toMatchSnapshot();
    });

    describe('Form submit', () => {
      it('should fire preventDefault when form is submitted', () => {
        el.find('FormWrapper').props().handleFormSubmit({ preventDefault });
        expect(preventDefault).toHaveBeenCalled();
      });

      it('should not submit the form if a radio option has not been selected', () => {
        el.find('FormWrapper').props().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).not.toHaveBeenCalled();
      });

      it('should not submit the form if referral is denied but no reason is given', () => {
        el.setState({
          approveReferral: 'no',
        });
        el.find('FormWrapper').props().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).not.toHaveBeenCalled();
      });

      it('should submit the form with the expected payload if referral is approved', () => {
        el.setState({
          approveReferral: 'yes',
        });
        el.find('FormWrapper').props().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).toHaveBeenCalledWith('');
      });

      it('should submit the form with the expected payload if referral is not approved', () => {
        el.setState({
          approveReferral: 'no',
          reasonForDenying: 'Nu uh',
        });
        el.find('FormWrapper').props().handleFormSubmit({ preventDefault });
        expect(props.onSubmit).toHaveBeenCalledWith('Nu uh');
      });
    });
  });
});
