import retryPromise from './retryPromise';

const wait = require('./wait');

jest.mock('./wait', () => jest.fn(() => Promise.resolve('hello')));

describe('retryPromise', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should resolve a happy path', async () => {
    const fn = () => Promise.resolve('Hello');

    const result = await retryPromise(fn);
    expect(result).toEqual('Hello');
  });

  it('should retry N number of times and then give up when retryTimes is provided', () =>
    retryPromise(() => Promise.reject('Hello world'), {
      retryTimes: 3,
    }).catch(e => {
      expect(e).toEqual('Hello world');
      expect(wait).toHaveBeenCalledTimes(3);
    }));

  it('should retry when a condition is true in `retryWhen` function.', () => {
    let alreadyCalled = false;

    const failFn = () => Promise.reject('Hello world');

    const retryWhen = jest.fn(() => {
      if (!alreadyCalled) {
        alreadyCalled = true;
        return true;
      }

      return false;
    });

    return retryPromise(failFn, { retryWhen }).catch(e => {
      expect(e).toEqual('Hello world');
      expect(retryWhen).toHaveBeenCalledTimes(2);
    });
  });

  it('should add a delay to all the retries', () => {
    const fn = () => Promise.reject('Hello world');

    return retryPromise(fn, { retryTimes: 1, delay: 200 }).catch(() => {
      expect(wait).toHaveBeenCalledTimes(1);
      expect(wait).toHaveBeenCalledWith(200);
    });
  });
});
