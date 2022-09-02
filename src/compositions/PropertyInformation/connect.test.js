import React from 'react';
import * as modalActions from '../../ducks/modal';
import * as actions from '../../ducks/tenancy';

import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

jest.mock('../', () => ({
  EditTenant: () => <div>Mock component</div>,
}));

describe('PropertyInformation connector', () => {
  let mockState;
  let mapStateToPropsResult;

  beforeEach(() => {
    mockState = state();
    mapStateToPropsResult = mapStateToProps(mockState);
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
    it('returns tenancyType: n/a when undefined', () => {
      const notTenancyTypeState = {
        ...mockState,
        tenancy: {
          ...mockState.tenancy,
          tenancyType: '',
        },
      };
      mapStateToPropsResult = mapStateToProps(notTenancyTypeState);
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let ownProps;
    let result;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(() => ({ catch: () => {}, then: cb => cb })),
      };
      ownProps = {
        bar: 'baz',
        match: {
          params: {
            arrearsId: 'foo',
          },
        },
        theme: { colors: { support: { two: 'red' } } },
      };
      actions.getTenancy = jest.fn();
      modalActions.hideModal = jest.fn();
      modalActions.setModalContent = jest.fn();
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });

    it('performs the correct actions when getTenantDetails fires', () => {
      result.getTenantDetails();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(actions.getTenancy).toHaveBeenCalledWith('ABC123');
    });

    it('performs the correct actions for onEditClick', () => {
      result.onEditClick({ foo: 'bar' });
      const setModalContentCall = modalActions.setModalContent.mock.calls[0][0];
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(setModalContentCall).toMatchSnapshot();
    });
  });
});
