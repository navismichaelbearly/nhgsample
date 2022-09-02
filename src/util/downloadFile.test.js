import { sharepointApi } from '../api';

jest.mock('../api', () => ({
  sharepointApi: {
    uriLocator: jest.fn(uri =>
      uri === 'fail' ? Promise.reject({ response: { status: 500 } }) : { data: { uri, bar: 'baz' } }
    ),
  },
}));

describe('retrieve a file', () => {
  it('should retrieve a file', async () => {
    const res = await sharepointApi.uriLocator('this is a uri locator');
    expect(res).toEqual({ data: { bar: 'baz', uri: 'this is a uri locator' } });
  });
});
