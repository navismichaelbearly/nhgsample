import * as actions from '../../ducks/ribbon';
import * as noteActions from '../../ducks/notes';
import * as notificationActions from '../../ducks/notifications';

import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('AddNote connector', () => {
  let mockState;
  let mapStateToPropsResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      bar: 'baz',
      match: {
        params: {
          arrearsId: 'foo',
        },
      },
    };
    mapStateToPropsResult = mapStateToProps(mockState, ownProps);
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let result;
    let redirectToDetailsPage;
    let redirectToAttachmentsPage;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(() => ({
          then: cb => {
            cb();
            return { catch: () => {} };
          },
        })),
      };
      actions.updateRibbon = jest.fn();
      noteActions.addNoteToCase = jest.fn();
      notificationActions.addNotification = jest.fn();
      redirectToDetailsPage = jest.fn();
      redirectToAttachmentsPage = jest.fn();
      result = mergeProps(
        {
          ...mapStateToPropsResult,
          redirectToDetailsPage,
          redirectToAttachmentsPage,
          pauseId: 'abc123',
        },
        dispatchProps,
        ownProps
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });

    it('performs the correct actions for updatePageHeader', () => {
      result.updatePageHeader();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(actions.updateRibbon).toHaveBeenCalled();
    });

    it('performs the correct actions for onBack', () => {
      result.onBack();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for onSubmit', () => {
      result.onSubmit('foo');
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(noteActions.addNoteToCase).toHaveBeenCalledWith(
        mapStateToPropsResult.arrearsId,
        'foo'
      );

      const addNotification = notificationActions.addNotification.mock.calls[0][0];
      expect(notificationActions.addNotification).toHaveBeenCalled();
      expect(addNotification).toMatchSnapshot();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for onSubmit with file uploads', () => {
      const wantsToAttachFiles = true;
      result.onSubmit('foo', wantsToAttachFiles);
      expect(redirectToAttachmentsPage).toHaveBeenCalled();
    });
  });
});
