import reducer, { loadStrings } from './';

const state = {
  foo: 'bar',
};

describe('dictionary reducer', () => {
  it('generates the correct state for a loadStrings action', () => {
    const result = reducer(
      state,
      loadStrings({
        string1: 'string1',
        stringgroup: {
          string2: 'string2',
        },
      })
    );
    expect(result).toEqual({
      ...state,
      string1: 'string1',
      stringgroup: {
        string2: 'string2',
      },
    });
  });
});
