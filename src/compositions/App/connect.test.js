import * as actions from '../../ducks/user';
import * as navActions from '../../ducks/navigation';

import { mapStateToProps, mergeProps } from './connect';

import state from '../../../__mocks__/state';

const mockState = state();
const stateProps = {
  user: {
    ...mockState.user,
  },
  ribbon: {
    ...mockState.ribbon,
  },
};

describe('mapStateToProps', () => {
  it('generates the correct props', () => {
    const result = mapStateToProps(mockState);
    expect(result).toEqual(stateProps);
  });
});

describe('mergeProps', () => {
  let dispatchProps;
  let ownProps;
  let result;

  beforeEach(() => {
    dispatchProps = {
      dispatch: jest.fn(),
    };
    ownProps = { prop: 'value' };
    actions.displayLogin = jest.fn();
    actions.logout = jest.fn();
    navActions.setEntryPoint = jest.fn();
    result = mergeProps(stateProps, dispatchProps, ownProps);
  });

  afterEach(() => {
    actions.displayLogin.mockClear();
    actions.logout.mockClear();
  });

  it('generates the correct props', () => {
    expect(result).toEqual({
      ...stateProps,
      login: expect.any(Function),
      logout: expect.any(Function),
      setEntryPoint: expect.any(Function),
      modal: {
        onClose: expect.any(Function),
      },
      ...ownProps,
    });
  });

  it('performs the correct actions when login fires', () => {
    result.login();
    expect(dispatchProps.dispatch).toHaveBeenCalled();
    expect(actions.displayLogin).toHaveBeenCalled();
  });

  it('performs the correct actions when logout fires', () => {
    result.logout();
    expect(dispatchProps.dispatch).toHaveBeenCalled();
    expect(actions.logout).toHaveBeenCalled();
  });

  it('performs the correct actions when setEntryPoint fires', () => {
    result.setEntryPoint('/path');
    expect(dispatchProps.dispatch).toHaveBeenCalled();
    expect(navActions.setEntryPoint).toHaveBeenCalledWith('/path');
  });
});
