import React from 'react';
import { shallow } from 'enzyme';

import { AddNoteComposition } from './';

describe('<AddNoteComposition />', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      addInteraction: 'addInteraction',
      addNote: 'addNote',
      arrearsId: 'foo',
      attachFile: 'attachFile',
      back: 'back',
      clearError: jest.fn(),
      formError: 'formError',
      note: 'note',
      noteError: 'noteError',
      onBack: jest.fn(),
      onSubmit: jest.fn(),
      updatePageHeader: jest.fn(),
      warning: 'warning',
      isLoading: false,
    };

    wrapper = shallow(<AddNoteComposition {...props} />);
  });

  it('should render the page', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the page correctly when there is an error', () => {
    wrapper.setProps({ error: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the page correctly when there is loading', () => {
    wrapper.setProps({ isLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should update the header', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should have expected state when submitting with no note', () => {
    const event = {
      target: { value: 'foobar test' },
    };
    const expected = {
      errors: {},
      fieldName: '',
      hideAddNote: true,
      maximumCharacterLength: 2000,
      warningMessage:
        'You cannot exceed 2000 characters for a note.  Try attaching your text as a separate document or reduce the character count.',
      note: '',
      wantsToAttachFiles: false,
    };

    wrapper.instance().onSubmit(event);
    expect(wrapper.state()).toEqual(expected);
  });

  it('should call onBack when notes form is cancelled', () => {
    const backBtn = wrapper.find('[data-bdd="CharacterCountTextbox-back"]');
    backBtn.simulate('click');
    expect(props.onBack).toHaveBeenCalled();
  });

  it('should call clearError on unmount', () => {
    wrapper.unmount();
    expect(props.clearError).toHaveBeenCalled();
  });

  describe('<handleInputChange />', () => {
    it.skip('should show inputBox and update state', () => {
      const inputBox = wrapper.find('CharacterCountTextbox');
      const fieldName = 'foo bar';
      const value = 'changed text';

      inputBox.simulate('change', fieldName, value);
      wrapper.update();

      expect(wrapper.state().fieldName).toEqual(fieldName);
      expect(wrapper.state().hideAddNote).toEqual(false);
      expect(wrapper.state().note).toEqual(value);
    });

    it.skip('should not hide add note CTA with long text', () => {
      const repeatText = 'a'.repeat(2000);
      const inputBox = wrapper.find('CharacterCountTextbox');
      const fieldName = 'foo bar';

      inputBox.simulate('change', fieldName, repeatText);
      wrapper.update();

      expect(wrapper.state().fieldName).toEqual(fieldName);
      expect(wrapper.state().hideAddNote).toEqual(false);
      expect(wrapper.state().note).toEqual(repeatText);
    });

    it.skip('should hide add note CTA with no text', () => {
      const inputBox = wrapper.find('CharacterCountTextbox');
      const fieldName = 'foo bar';

      inputBox.simulate('change', fieldName, '');
      wrapper.update();

      expect(wrapper.state().fieldName).toEqual(fieldName);
      expect(wrapper.state().hideAddNote).toEqual(true);
      expect(wrapper.state().note).toEqual('');
    });

    it.skip('should submit note onClick ', () => {
      const inputBox = wrapper.find('CharacterCountTextbox');
      const fieldName = 'foo bar';
      const value = 'changed text';

      inputBox.simulate('change', fieldName, value);
      wrapper.update();

      const submitButton = wrapper.find('[data-bdd="CharacterCountTextbox-submit"]');
      submitButton.simulate('click');

      expect(props.onSubmit).toHaveBeenCalledWith(value, false);
    });

    it('should update state on changing attachmentFile', () => {
      const attachFiles = wrapper.find('[data-bdd="addNoteForm-attachFiles"]');

      attachFiles.simulate('change');
      wrapper.update();
      expect(wrapper.state().wantsToAttachFiles).toEqual(true);

      attachFiles.simulate('change');
      wrapper.update();
      expect(wrapper.state().wantsToAttachFiles).toEqual(false);
    });
  });
});
