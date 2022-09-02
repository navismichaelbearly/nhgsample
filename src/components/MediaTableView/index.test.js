import React from 'react';
import { Loader, Button, testUtils } from 'nhh-styles';
import { shallow, mount } from 'enzyme';

import { SuccessWrapper, ErrorWrapper } from './components';

import MediaTableView from './';

const FileObject = {
  id: 'some-id',
  retryTimes: 1,
  hasBeenUploaded: false,
  isUploading: false,
  hasUploadError: false,
  errorText: null,
  src: {
    name: 'Hello',
  },
};

describe('<MediaTableView />', () => {
  let props;

  beforeEach(() => {
    props = {
      files: [],
      genericErrorMessage: 'Oops',
      displayUploadErrors: false,
      onRetry: jest.fn(),
      onRemove: jest.fn(),
      removeButtonLabel: 'Remove it',
      retryButtonLabel: 'Retry it',
      uploadSuccessMessage: 'Successful',
    };
  });

  it('should render correctly with default props', () => {
    expect(shallow(<MediaTableView {...props} />)).toMatchSnapshot();
  });

  it('should render a Loading component when a file isUploading', () => {
    props = {
      ...props,
      files: [
        {
          ...FileObject,
          isUploading: true,
        },
      ],
    };

    const el = mount(<MediaTableView {...props} />);
    expect(el.find(Loader)).toExist();
  });

  it('should render correctly when a file hasBeenUploaded', () => {
    props = {
      ...props,
      files: [
        {
          ...FileObject,
          hasBeenUploaded: true,
        },
      ],
    };

    const el = mount(<MediaTableView {...props} />);
    expect(el.find(SuccessWrapper)).toExist();
    expect(el.text()).toContain(props.uploadSuccessMessage);
  });

  describe('hasUploadError', () => {
    let el;
    let errorWrapper;

    beforeEach(() => {
      props = {
        ...props,
        files: [
          {
            ...FileObject,
            errorText: 'Hello error',
            hasUploadError: true,
          },
        ],
      };

      el = mount(testUtils.withTheme(<MediaTableView {...props} />));
      errorWrapper = el.find(ErrorWrapper);
    });

    it('should render correctly', () => {
      expect(errorWrapper).toExist();
      expect(errorWrapper.text()).toContain(props.retryButtonLabel);
    });

    it('should perform a retry action on first button click', () => {
      errorWrapper.find('button').first().props().onClick();
      expect(props.onRetry).toHaveBeenCalledWith(props.files[0]);
    });

    it('should perform remove action on second button click', () => {
      errorWrapper.find('button').at(1).props().onClick();
      expect(props.onRemove).toHaveBeenCalledWith(props.files[0]);
    });
  });

  describe('default file state', () => {
    let el;
    let button;

    beforeEach(() => {
      props = {
        ...props,
        files: [FileObject],
      };

      el = mount(testUtils.withTheme(<MediaTableView {...props} />));

      button = el.find(Button);
    });

    it('should render correctly', () => {
      expect(button).toExist();
      expect(button.text()).toEqual(props.removeButtonLabel);
    });

    it('should call a remove action on remove button click', () => {
      button.props().onClick();
      expect(props.onRemove).toHaveBeenCalledWith(props.files[0]);
    });
  });
});
