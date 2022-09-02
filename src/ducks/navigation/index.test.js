import reducer, { setEntryPoint } from './';

const state = {
  foo: 'bar',
};

describe('navigation reducer', () => {
  it('generates the correct state for a setEntryPoint action', () => {
    const result = reducer(state, setEntryPoint('/path'));
    expect(result).toEqual({
      ...state,
      entryPoint: '/path',
    });
  });
});
