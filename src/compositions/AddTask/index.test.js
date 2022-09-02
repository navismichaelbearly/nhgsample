import React from 'react';
import { shallow } from 'enzyme';

import { AddTaskComposition } from './';

describe('<AddTask />', () => {
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
    clearUserSearch: () => {},
    onBack: () => {},
    onSubmit: () => {},
    cancelText: 'Cancel Text',
    housingOfficerSearchResults: [],
    onCancel: () => {},
    onSearch: () => {},
    updatePageHeader: () => {},
    onDisplayFormError: () => {},
    error: false,
    loading: false,
    errorMessage: 'This is the error message',
    userFullName: 'USER_FULL_NAME',
    userId: 'CURRENT_USER_ID',
    loggedInUserId: 'LOGGEDIN_USER_ID',
    onUnmount: jest.fn(),
  };

  const renderAddTask = (props = {}) =>
    shallow(<AddTaskComposition {...defaultProps} {...props} />);

  it('should render the page', () => {
    expect(renderAddTask()).toMatchSnapshot();
  });

  it('should render the page with visible error', () => {
    expect(renderAddTask({ error: true })).toMatchSnapshot();
  });

  it('should call onUnmount on unmount', () => {
    const el = renderAddTask();
    el.unmount();
    expect(defaultProps.onUnmount).toHaveBeenCalled();
  });
});
