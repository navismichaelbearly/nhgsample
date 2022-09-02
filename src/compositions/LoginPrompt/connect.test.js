import { mapStateToProps } from './connect';

import state from '../../../__mocks__/state';

const mockState = state();

const stateProps = {
  entryPoint: '/',
  user: mockState.user,
};

describe('mapStateToProps', () => {
  it('generates the correct props', () => {
    const result = mapStateToProps(mockState);
    expect(result).toEqual(stateProps);
  });
});
