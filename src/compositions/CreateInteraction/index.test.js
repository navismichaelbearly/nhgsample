import React from 'react';
import { shallow } from 'enzyme';
import { RadioGroup, Typography } from 'nhh-styles';
import { FormWrapper } from '../../components';

import { CreateInteractionCompositions } from './';

jest.mock('date-fns/start_of_today', () => () => new Date('2018-08-01'));
jest.mock('../../util/timeNow', () => () => new Date('2018-08-01'));

function sel(id) {
  return `[data-state-key="${id}"]`;
}

describe('<CreateInteractionCompositions />', () => {
  let props;
  let el;
  const preventDefault = jest.fn();

  beforeEach(() => {
    props = {
      activityKinds: ['Outbound', 'Inbound'],
      activityTypes: [
        {
          id: 0,
          name: 'Email',
        },
        {
          id: 1,
          name: 'In Person',
        },
        {
          id: 2,
          name: 'Letter',
        },
        {
          id: 3,
          name: 'Messaging',
        },
        {
          id: 4,
          name: 'Phone Call',
        },
        {
          id: 5,
          name: 'Voicemail',
        },
      ],
      clearError: jest.fn(),
      error: false,
      errorText: {
        activityKind: 'Please select the activity kind',
        description: 'Please enter a description',
        interactingParty: 'Please select the party you interacted with',
        interactionDate: 'Please select the interaction date',
        interactionDateOrTime: 'Please select an interaction date and time',
        interactionTime: 'Please select the interaction time',
        interactionType: 'Please select the type of interaction',
      },
      formError: 'There was a problem adding this interaction, please try again.',
      getActivityTypes: jest.fn(),
      getTenantDetails: jest.fn(),
      isLoading: false,
      labels: {
        attachMedia: 'Attach',
        backButton: 'Back',
        description: 'Description',
        interactingParty: 'Party the interaction was with',
        interactionDateAndTime: 'Date / time of interaction',
        interactionType: 'Type of interaction',
        submitButton: 'Save interaction',
        submitAndCreateTaskButton: 'Save interaction and add Task',
      },
      onBack: jest.fn(),
      onSubmit: jest.fn(),
      tenants: [
        {
          name: 'tenant1',
          id: '123123123',
        },
        {
          name: 'tenant2',
          id: '7171711',
        },
      ],
      timeSlots: ['21:30', '21:35'],
      updatePageHeader: jest.fn(),
      thirdParty: {
        thirdParties: undefined,
        thirdPartyLabel: 'THIRD PARTY',
        getThirdParties: jest.fn(),
        thirdPartiesError: false,
        thirdPartyErrorText: 'this is an error on thirdparty radiobutton',
      },
    };

    el = shallow(<CreateInteractionCompositions {...props} />);
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should call updatePageHeader', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should call getActivityTypes', () => {
    expect(props.getActivityTypes).toHaveBeenCalled();
  });

  it('should call getThirdParties', () => {
    expect(props.thirdParty.getThirdParties).toHaveBeenCalled();
  });

  it('should call getTenantDetails', () => {
    expect(props.getTenantDetails).toHaveBeenCalled();
  });

  it('should render correctly when isLoading', () => {
    const newProps = {
      ...props,
      isLoading: true,
    };
    el.setProps(newProps).update();
    expect(el).toMatchSnapshot();
  });

  describe('Form state changes', () => {
    it('should update state when interactionType changes', () => {
      const interactionType = el.find(sel('interactionType'));
      const target = props.activityTypes[0].id;
      interactionType.props().onChange({ name: target });
      el.update();
      expect(el.state().interactionType).toEqual(target);
    });

    it('should update state when activityKind changes', () => {
      const activityKind = el.find(sel('activityKind'));
      const targetActivityKind = props.activityKinds.find(
        ak => ak === activityKind.first().prop('children')
      );
      activityKind.get(0).props.onChange();
      el.update();
      expect(el.state().activityKind).toEqual(targetActivityKind);
    });

    it('should update state when interactingParty changes', () => {
      const interactingParty = el.find(sel('interactingParty'));
      const targetInteractingParty = props.tenants.find(
        ip => ip.name === interactingParty.first().prop('children')
      ).id;
      interactingParty.get(0).props.onChange();
      el.update();
      expect(el.state().interactingParty).toEqual(targetInteractingParty);
    });

    it('should update state when interactionDate changes', () => {
      const interactionDate = el.find(sel('interactionDate'));
      const target = new Date('2018-02-22T00:00:00.000Z');
      interactionDate.props().onDateSelected(null, target);
      el.update();
      expect(el.state().interactionDate).toEqual(target);
    });

    it('should update state when interactionTime changes', () => {
      const interactionTime = el.find(sel('interactionTime'));
      const target = props.timeSlots.find(
        slot => slot === interactionTime.first().prop('children')
      );
      interactionTime.get(0).props.onChange();
      el.update();
      expect(el.state().interactionTime).toEqual(target);
    });

    it('should update state when description changes', () => {
      const note = el.find(sel('description'));
      const target = 'some note';
      note.props().onChange({ target: { dataset: { stateKey: 'description' }, value: target } });
      el.update();
      expect(el.state().description).toEqual(target);
    });

    it('should update state when attachMedia changes', () => {
      const checkbox = el.find(sel('attachMedia'));
      checkbox.props().onChange({ value: true });
      el.update();
      expect(el.state().wantsToAttachMedia).toEqual(true);
    });

    it('should update state when thirdParties is defined', () => {
      el.setProps({
        thirdParty: {
          thirdParties: {
            partyId: 'this is a party id',
            contactId: 'this isa guid',
            id: 'this is the same as the contact id',
            name: 'this is the same as thirdPartyLabel',
          },
        },
      });
      el.update();
      expect(el).toMatchSnapshot();
    });

    it('should update state when thirdParties api returns an error', () => {
      el.setProps({ thirdParty: { thirdParties: undefined, thirdPartiesError: true } });
      el.update();
      expect(el).toMatchSnapshot();
    });
  });

  describe('Submits with Correct Arguments', () => {
    const submitFormButton = currentEl =>
      currentEl.find(FormWrapper).props().otherActions.props.onClick({ preventDefault });
    describe('Form Submit', () => {
      it('should send a URL as a second argument to the sumbit method', () => {
        const instance = el.instance(); // required because handleSubmit is an arrow function
        const spyOnSubmit = jest.spyOn(instance, 'handleSubmit');
        submitFormButton(el);
        el.update();
        expect(spyOnSubmit).toHaveBeenCalledWith({ preventDefault }, '/task/create');
      });
    });
  });

  describe('Form validations', () => {
    const submitForm = currentEl =>
      currentEl.find(FormWrapper).props().handleFormSubmit({ preventDefault });

    describe('Interaction type', () => {
      it('should set the correct error when interaction type is not selected', () => {
        submitForm(el);
        el.update();
        const interactionType = el.find(sel('interactionType'));
        expect(interactionType.props().error).toMatchSnapshot();
        expect(props.onSubmit).not.toHaveBeenCalled();
      });

      it('should NOT set any errors when plan type is selected', () => {
        const target = props.activityTypes[0].id;
        el.find(sel('interactionType')).props().onChange({ name: target });
        submitForm(el);
        el.update();
        expect(el.find(sel('interactionType')).props().error).toBe('');
      });
    });

    describe('Activity Kind', () => {
      it('should set the correct error when activity kind is not provided', () => {
        submitForm(el);
        el.update();
        expect(el.find(RadioGroup).find('[name="activityKind"]').props().error).toMatchSnapshot();
        expect(props.onSubmit).not.toHaveBeenCalled();
      });

      it('should NOT set any errors when activity kind is provided', () => {
        const activityKindOption1 = el.find(sel('activityKind')).first();
        activityKindOption1.props().onChange();
        el.update();
        submitForm(el);
        expect(activityKindOption1.props().error).toBeFalsy();
      });
    });

    describe('Interacting Party', () => {
      it('should set the correct error when interacting party is not provided', () => {
        submitForm(el);
        el.update();
        expect(
          el.find(RadioGroup).find('[name="interactingParty"]').props().error
        ).toMatchSnapshot();
        expect(props.onSubmit).not.toHaveBeenCalled();
      });

      it('should NOT set any errors when interacting party is provided', () => {
        const interactingPartyOption1 = el.find(sel('interactingParty')).first();
        interactingPartyOption1.props().onChange();
        el.update();
        submitForm(el);
        expect(interactingPartyOption1.props().error).toBeFalsy();
      });
    });

    describe('Interaction Date and time', () => {
      const dateTimeErrorComponent = currentEl => currentEl.find(Typography.Error);
      it('should set the correct error when interaction date or time are not selected', () => {
        submitForm(el);
        el.update();
        expect(dateTimeErrorComponent(el)).toHaveLength(1);
        expect(dateTimeErrorComponent(el).html()).toContain(props.errorText.interactionDateOrTime);
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
      it('should NOT set the correct error when interaction date and interaction time are selected', () => {
        el.find(sel('interactionDate'))
          .props()
          .onDateSelected(null, new Date('2018-02-22T00:00:00.000Z'));
        el.find(sel('interactionTime')).props().onChange('09:30');
        submitForm(el);
        el.update();
        expect(dateTimeErrorComponent(el)).toHaveLength(0);
      });
    });

    describe('description', () => {
      it('should set the correct error when description is not selected', () => {
        submitForm(el);
        el.update();
        const description = el.find(sel('description'));
        expect(description.props().error).toMatchSnapshot();
        expect(props.onSubmit).not.toHaveBeenCalled();
      });
      it('should NOT set the correct error when description is selected', () => {
        el.find(sel('description'))
          .props()
          .onChange({ target: { dataset: { stateKey: 'description' }, value: 'someVal' } });
        submitForm(el);
        el.update();
        expect(el.find(sel('description')).props().error).toBe('');
      });
    });
  });

  it('should call clearError on unmount', () => {
    el.unmount();
    expect(props.clearError).toHaveBeenCalled();
  });
});
