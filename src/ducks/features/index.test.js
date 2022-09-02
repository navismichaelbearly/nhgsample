import reducer, { loadFeatures } from './';

jest.mock('../../constants/features', () => ({ bar: 'baz' }));

const state = {
  foo: 'bar',
};

describe('features reducer', () => {
  it('generates the correct state for a loadFeatures action', () => {
    const result = reducer(state, loadFeatures());
    expect(result).toEqual({
      ...state,
      bar: 'baz',
    });
  });
});
