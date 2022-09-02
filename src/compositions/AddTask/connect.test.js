import * as actions from '../../ducks/ribbon';
import * as taskActions from '../../ducks/tasks';
import * as notificationActions from '../../ducks/notifications';
import * as housingofficersActions from '../../ducks/housingofficersearch';
import { mapStateToProps, mergeProps } from './connect';

import state from '../../../__mocks__/state';

describe('AddTask connector', () => {
  let mockState;
  let mapStateToPropsResult;
  let ownProps;
  const arrearsId = 'ARREARS_ID_FROM_URL';

  beforeEach(() => {
    mockState = state();
    ownProps = {
      bar: 'baz',
      match: {
        params: {
          arrearsId,
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
      taskActions.addTask = jest.fn();
      taskActions.clearTaskError = jest.fn();
      notificationActions.addNotification = jest.fn();
      housingofficersActions.search = jest.fn();
      housingofficersActions.clearSearch = jest.fn();
      redirectToDetailsPage = jest.fn();
      result = mergeProps(
        { ...mapStateToPropsResult, redirectToDetailsPage },
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

    it('performs the correct actions for onUnmount', () => {
      result.onUnmount();
      expect(taskActions.clearTaskError).toHaveBeenCalled();
      expect(housingofficersActions.clearSearch).toHaveBeenCalled();
    });

    describe('onSearch', () => {
      it('should call "search" action if the term is the correct length', () => {
        const searchTerm = 'SEARCH_TERM';
        result.onSearch(searchTerm);
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(housingofficersActions.search).toHaveBeenCalledWith(searchTerm);
      });

      it('should call "clearSearch" action only if the term has no length', () => {
        const searchTerm = '';
        result.onSearch(searchTerm);
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(housingofficersActions.clearSearch).toHaveBeenCalledWith();
      });
    });

    it('performs the correct actions for onBack', () => {
      result.onBack();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for onSubmit', () => {
      const title = 'TITLE';
      const description = 'DESCRIPTION';
      const date = '2018-09-19T20:00:00.000Z';
      const userId = mockState.user.profile.id;
      const ownerId = 'ownerId';
      result.onSubmit({ title, description, date, ownerId });

      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(taskActions.addTask).toHaveBeenCalledWith(
        arrearsId,
        title,
        description,
        date,
        ownerId,
        userId
      );

      const addNotification = notificationActions.addNotification.mock.calls[0][0];
      expect(notificationActions.addNotification).toHaveBeenCalled();
      expect(addNotification).toMatchSnapshot();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });
  });
});
