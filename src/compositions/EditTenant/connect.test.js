import * as modalActions from '../../ducks/modal';
import * as customerActions from '../../ducks/customer';
import * as tenantActions from '../../ducks/tenancy';

import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('ArrearsDetail connector', () => {
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
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let result;
    let ownProps;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(() => ({ then: cb => cb() })),
      };
      modalActions.setModalContent = jest.fn();
      customerActions.updateCustomerProfile = jest.fn();
      customerActions.patchCustomerProfileReset = jest.fn();
      tenantActions.patchTenant = jest.fn();
      ownProps = { tenant: { foo: 'bar' } };
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });

    it('performs the correct actions for onCancel', () => {
      result.onCancel();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(modalActions.setModalContent).toHaveBeenCalledWith();
    });

    it('performs the correct actions for onSubmit', () => {
      result.onSubmit('ABC123', { foo: 'bar' });
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(customerActions.updateCustomerProfile).toHaveBeenCalledWith('ABC123', {
        foo: 'bar',
      });
      expect(tenantActions.patchTenant).toHaveBeenCalledWith({
        contactId: 'ABC123',
        foo: 'bar',
      });
    });

    it('performs the correct actions for onUnmount', () => {
      result.onUnmount();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(customerActions.patchCustomerProfileReset).toHaveBeenCalledWith();
    });
  });
});
