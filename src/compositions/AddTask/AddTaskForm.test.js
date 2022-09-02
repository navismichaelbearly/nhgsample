import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import AddTaskForm from './AddTaskForm';

describe('<AddTaskForm />', () => {
  const defaultProps = {
    addTask: {
      addTask: 'Add Task',
      addTaskButton: 'Add Task Button',
      assignToMeLabel: 'Assign to me label',
      backButton: 'Back Button',
      dateErrorText: 'Date error text',
      dateLabel: 'Date Title:',
      descriptionErrorText: 'Description error text',
      descriptionLabel: 'Description Title:',
      submitButton: 'Submit',
      titleErrorText: 'Title error text',
      titleLabel: 'Task Title:',
      userPickerLabel: 'User Picker label',
      userPickerPlaceholder: 'User Picker Placeholder',
    },
    arrearsId: 'ARREARS_ID',
    housingOfficerSearchResults: [],
    onBack: jest.fn(),
    onSubmit: () => {},
    onDisplayFormError: () => {},
    cancelText: 'Cancel Text',
    clearUserSearch: () => {},
    onCancel: () => {},
    onSearch: () => {},
    loading: false,
    userFullName: 'USER_FULL_NAME',
    userId: 'CURRENT_USER_ID',
    loggedInUserId: 'LOGGEDIN_USER_ID',
  };

  const renderAddTaskForm = (props = {}) => shallow(<AddTaskForm {...defaultProps} {...props} />);

  it('should render <AddTaskForm /> correctly', () => {
    expect(renderAddTaskForm()).toMatchSnapshot();
  });

  it('should render <AddTaskForm /> correctly when loading=true', () => {
    expect(renderAddTaskForm({ loading: true })).toMatchSnapshot();
  });

  it('should call onBack when back is clicked', () => {
    const el = renderAddTaskForm();
    el.find('[data-bdd="addTaskForm-cancel"]').simulate('click');
    expect(defaultProps.onBack).toHaveBeenCalled();
  });

  describe('when form submitted without required values', () => {
    let onDisplayFormError;

    beforeEach(() => {
      onDisplayFormError = jest.fn();
    });

    it('title input should display error message when empty', () => {
      const el = renderAddTaskForm({ onDisplayFormError });
      el.find('[data-bdd="addTaskForm"]').simulate('submit', { preventDefault: () => {} });
      const titleInput = el.find('[data-bdd="addTaskForm-title"]');
      expect(titleInput.props().error).toBe(defaultProps.addTask.titleErrorText);
      expect(onDisplayFormError).toHaveBeenCalled();
    });

    it('description input should display error message when empty', () => {
      const el = renderAddTaskForm();
      el.find('[data-bdd="addTaskForm"]').simulate('submit', { preventDefault: () => {} });
      const descriptionInput = el.find('[data-bdd="addTaskForm-description"]');
      expect(descriptionInput.props().error).toBe(defaultProps.addTask.descriptionErrorText);
    });

    it('dateInput input should display error message when empty', () => {
      const el = renderAddTaskForm();
      el.find('[data-bdd="addTaskForm"]').simulate('submit', { preventDefault: () => {} });
      const dateInput = el.find('[data-bdd="addTaskForm-date"]');
      expect(dateInput.props().error).toBe(defaultProps.addTask.dateErrorText);
    });
  });

  describe('when form submitted with values', () => {
    let onSubmit = jest.fn();
    const titleText = 'Title Text';
    const descriptionText = 'This the description text';
    const dateText = 'Thu Sep 20 2018 00:00:00 GMT+0100';

    beforeEach(() => {
      onSubmit = jest.fn();

      const el = renderAddTaskForm({ onSubmit });
      const titleInput = el.find('[data-bdd="addTaskForm-title"]');
      titleInput.props().onChange({ target: { value: titleText } });

      const descriptionInput = el.find('[data-bdd="addTaskForm-description"]');
      descriptionInput.props().onChange({ target: { value: descriptionText } });

      const dateInput = el.find('[data-bdd="addTaskForm-date"]');
      dateInput.props().onDateSelected(dateText);

      const assignToMeCheckbox = el.find('[data-bdd="addTaskForm-assignToMe"]');
      assignToMeCheckbox.props().onChange(true);

      el.find('[data-bdd="addTaskForm"]').simulate('submit', { preventDefault: () => {} });
    });

    it('argument title should be onSubmit argument', () => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ title: titleText }));
    });

    it('argument description should be onSubmit argument', () => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ description: descriptionText })
      );
    });

    it('argument date should be onSubmit argument', () => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ date: dateText }));
    });

    it('argument assignToMe should be onSubmit argument', () => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ assignToMe: false }));
    });
  });

  describe('when assigning a task to a user', () => {
    it('should not show userPicker by default', () => {
      const el = renderAddTaskForm();
      const userPicker = el.find('[data-bdd="addTaskForm-userPicker"]');
      expect(userPicker).not.toExist();
    });

    it('should have assignToMe checkbox as checked by default', () => {
      const el = renderAddTaskForm();
      const assignToMeCheckBox = el.find('[data-bdd="addTaskForm-assignToMe"]');
      expect(assignToMeCheckBox.props().checked).toEqual(true);
    });

    it('should display UserPicker when assignToMe is checked', () => {
      const el = renderAddTaskForm();
      const userPicker = el.find('[data-bdd="addTaskForm-userPicker"]');
      const assignToMeCheckBox = el.find('[data-bdd="addTaskForm-assignToMe"]');

      expect(userPicker).not.toExist();

      assignToMeCheckBox.props().onChange();
      el.update();

      expect(el.find('[data-bdd="addTaskForm-userPicker"]')).toExist();
    });

    it('should display user selected in the UserPicker', () => {
      const onSubmit = jest.fn();

      const el = renderAddTaskForm({ onSubmit });
      el.setState({ assignToMe: false, title: 'TITLE', description: 'DESCRIPTION ', date: 'DATE' });

      el.update();
      el.find('[data-bdd="addTaskForm-userPicker"]')
        .props()
        .onUserSelected({ fullName: 'FULL_NAME', id: 'SELECTED_USER_ID' });

      el.find('[data-bdd="addTaskForm"]').simulate('submit', { preventDefault: () => {} });

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ taskedAssignedTo: 'FULL_NAME' })
      );
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ ownerId: 'SELECTED_USER_ID' })
      );
    });

    it('should reset the "Task Assigned to" value to the loggedInUser when the "assign to me" checkbox is clicked', () => {
      const onSubmit = jest.fn();

      const el = renderAddTaskForm({ onSubmit });
      el.setState({ assignToMe: false, title: 'TITLE', description: 'DESCRIPTION ', date: 'DATE' });

      el.update();
      el.find('[data-bdd="addTaskForm-userPicker"]')
        .props()
        .onUserSelected({ fullName: 'SELECTED_USER_FULL_NAME', id: 'SELECTED_USER_ID' });

      const assignToMeCheckbox = el.find('[data-bdd="addTaskForm-assignToMe"]');
      assignToMeCheckbox.props().onChange(false);

      el.find('[data-bdd="addTaskForm"]').simulate('submit', { preventDefault: () => {} });

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ taskedAssignedTo: defaultProps.userFullName })
      );

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ ownerId: defaultProps.loggedInUserId })
      );
    });

    it('should call clearUserSearch if the task is newly assigned to me', () => {
      const clearUserSearch = jest.fn();
      const el = renderAddTaskForm({ clearUserSearch });
      el.setState({ assignToMe: false, title: 'TITLE', description: 'DESCRIPTION ', date: 'DATE' });
      const assignToMeCheckbox = el.find('[data-bdd="addTaskForm-assignToMe"]');
      assignToMeCheckbox.props().onChange(false);
      expect(clearUserSearch).toHaveBeenCalled();
    });

    it('should change the assignee back to the original user if the same user is selected again in the UserPicker', () => {
      const originalUser = {
        userFullName: 'USER_FULL_NAME',
        loggedInUserId: 'LOGGEDIN_USER_ID',
      };
      const el = renderAddTaskForm(originalUser);
      const assignee = { fullName: 'SELECTED_USER_FULL_NAME', id: 'SELECTED_USER_ID' };
      // simulate assigning a user
      el.setState({
        assignToMe: false,
        title: 'TITLE',
        description: 'DESCRIPTION ',
        date: 'DATE',
        ownerId: assignee.id,
        taskedAssignedTo: assignee.fullName,
      });
      el.update();
      el.find('[data-bdd="addTaskForm-userPicker"]').props().onUserSelected(assignee);
      expect(el.state()).toMatchObject({
        ownerId: originalUser.loggedInUserId,
        taskedAssignedTo: originalUser.userFullName,
      });
    });
  });
});
