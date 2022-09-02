import dictionary from './';

jest.mock('./en-GB', () => ({ foo: 'bar' }));
jest.mock('./test-LANG', () => ({ bar: 'baz' }));

describe('dictionary getter', () => {
  it('Returns the correct language strings if specified', () => {
    expect(dictionary('test')).toEqual({ bar: 'baz' });
  });

  it("Returns the en-GB if it can't match the specified language", () => {
    expect(dictionary('foo')).toEqual({ foo: 'bar' });
  });

  it('Returns the en-GB as default', () => {
    expect(dictionary()).toEqual({ foo: 'bar' });
  });
});
