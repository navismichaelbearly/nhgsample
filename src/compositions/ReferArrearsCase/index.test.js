import React from 'react';
import { shallow } from 'enzyme';
import { Radio, RadioGroup, Textarea } from 'nhh-styles';
import { ReferArrearsCaseComposition } from './';

describe('<ReferArrearsCaseComposition />', () => {
  let preventDefault;
  let props;
  let el;

  beforeEach(() => {
    preventDefault = jest.fn();
    props = {
      referralError: false,
      errorMessage: 'this is an error',
      isLoading: false,
      getReferralTeams: jest.fn(),
      onBack: jest.fn(),
      onSubmit: jest.fn(),
      referralTeams: [
        {
          id: 'rt-1',
          name: 'Benefits advice',
        },
        {
          id: 'rt-2',
          name: 'Tenancy support',
        },
      ],
      text: {
        back: 'back',
        detailsError: 'Please enter some details',
        heading1: 'Refer arrears case',
        heading2: 'Tenancy sustainment referral',
        referDetailsLabel: 'Details',
        referTo: 'Refer to',
        referredFor: 'Referred for',
        referTeamError: 'Please select an option',
        submit: 'Refer arrears case',
        successMessage: 'Arrears case referred',
      },
      updatePageHeader: jest.fn(),
    };
    el = shallow(<ReferArrearsCaseComposition {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should call updatePageHeader', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should render correctly when loading', () => {
    el.setProps({ isLoading: true }).update();
    expect(el).toMatchSnapshot();
  });

  it('should render correctly with an error', () => {
    el.setProps({ referralError: true }).update();
    expect(el).toMatchSnapshot();
  });

  it('should call getReferralTeams', () => {
    expect(props.getReferralTeams).toHaveBeenCalled();
  });

  it('selecting a referral team should be reflect in the UI', () => {
    el.find(Radio).first().props().onChange();
    el.update();

    expect(el.find(Radio).first().props().checked).toEqual(true);
  });

  it('updating the details textarea should update its value', () => {
    const text = 'text';
    el.find(Textarea)
      .props()
      .onChange({ target: { value: text } });
    el.update();

    expect(el.find(Textarea).props().value).toEqual(text);
  });

  it('clicking on the back button should call the relevant passed in prop and reset the form', () => {
    const updatedText = 'update';
    el.find(Textarea)
      .props()
      .onChange({ target: { value: updatedText } });
    el.update();
    el.instance().handleBackClick();
    expect(props.onBack).toHaveBeenCalled();
    expect(el.find(Textarea).props.value).not.toEqual(updatedText);
    expect(el.find(Radio).findWhere(n => n.props().checked === true).length).toEqual(0);
  });

  it('should show details error on submit if validations fail', () => {
    el.instance().handleFormSubmit({ preventDefault });
    el.update();
    expect(el.find(Textarea).props().error).toMatchSnapshot();
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should show referral team error on submit if validations fail', () => {
    el.instance().handleFormSubmit({ preventDefault });
    el.update();
    expect(el.find(RadioGroup).props().error).toMatchSnapshot();
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should call the relevant passed in onSubmit prop if validations pass', () => {
    const text = 'text';
    el.find(Textarea)
      .props()
      .onChange({ target: { value: text } });
    el.find(Radio).first().props().onChange();
    el.update();
    el.instance().handleFormSubmit({ preventDefault });
    el.update();
    expect(props.onSubmit).toHaveBeenCalledWith(text, props.referralTeams[0]);
    // expect(el.find(Textarea).props.value).not.toEqual(text);
    // expect(el.find(Radio).findWhere(n => n.props().checked === true).length).toEqual(0);
    expect(preventDefault).toHaveBeenCalled();
  });
});
