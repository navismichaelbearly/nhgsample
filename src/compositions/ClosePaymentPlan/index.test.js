import React from 'react';
import { shallow } from 'enzyme';

import { ClosePaymentPlanCompositions } from './';

function sel(id) {
  return `[data-bdd="${id}"]`;
}

describe('<ClosePaymentPlanCompositions />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      heading: 'closePaymentPlan',
      labels: {
        closePlanDescription: 'Are you sure you want to close this payment plan?',
        closePlanDisclaimer:
          'Closing this payment plan will not automatically terminate the financial arrangement. Separate action required',
        closePlanNo: 'No',
        closePlanYes: 'Yes, Close the plan',
        newArrangementOption: 'New Arrangement Option',
        reasonText: 'reason text',
        reasonSelect: 'Select reason',
        pleaseSelectAReason: 'Please select a reason...',
        tenantDefaultOption: 'Tenant Default Option',
      },
      errorText: {
        closePlanSelectRequired: 'Close selected plan reason..',
      },
      onCancel: jest.fn(),
      onClose: jest.fn(),
      isLoading: false,
    };
    el = shallow(<ClosePaymentPlanCompositions {...props} />);
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should update state when loading', () => {
    el.setProps({ isLoading: true });
    el.update();
    expect(el).toMatchSnapshot();
  });

  it('should call onCancel when no is clicked', () => {
    const no = el.find(sel('closePaymentPlan-no'));
    no.simulate('click');
    expect(props.onCancel).toHaveBeenCalled();
  });

  it('should NOT call onClose when yes is clicked with NO reason selected', () => {
    const yes = el.find(sel('closePaymentPlan-yes'));
    yes.simulate('click');
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it('should display error on dropdown when onClose called with NO reason selected', () => {
    const yes = el.find(sel('closePaymentPlan-yes'));
    yes.simulate('click');
    el.update();
    const reasonSelect = el.find(sel('closePaymentPlan-select-reason'));
    expect(reasonSelect.props().error).toBe(props.errorText.closePlanSelectRequired);
  });

  it('should call onClose with expect params when yes is clicked and reason has been selected', () => {
    const reason = 'New Arrangement';
    const note = 'This is a note';
    const yes = el.find(sel('closePaymentPlan-yes'));
    el.setState({ reason });
    el.setState({ note });
    yes.simulate('click');
    expect(props.onClose).toHaveBeenCalledWith({
      terminationReason: reason,
      note,
    });
  });

  it('should update state when "New Arrangement" selected from reason dropdown', () => {
    const reasonSelect = el.find(sel('closePaymentPlan-select-reason'));
    const newArrangement = 'New Arrangement';
    reasonSelect.props().onSelect({ name: newArrangement });
    el.update();
    expect(el.state().reason.name).toEqual(newArrangement);
  });

  it('should update state when note textarea has been updated', () => {
    const noteCtrl = el.find(sel('closePaymentPlan-note'));
    const note = 'This is a note...';
    noteCtrl.simulate('change', { target: { value: note } });
    el.update();
    expect(el.state().note).toEqual(note);
  });
});
