import wait from './wait';

/*
  This function takes 2 arguments - a function that returns a promise
  and an options object. Options object can look like this:
  {
    retryTimes: number   | how many times to retry it for,
    retryWhen:  function | returning a boolean,
    delay:      number   | milliseconds, that will delay the next retry
  }
  It can be either retryTimes OR retryWhen, not both.

  Usage example:
  retryPromise(someFunctionReturningAPromise, { retryTimes: 3, delay: 3000 })
    .then(resolvedValueFromPromise => { ... })
    .catch(errorAfterAllTheRetries => { ... })
*/
const retryPromise = async (fn, options) => {
  try {
    return await fn();
  } catch (e) {
    const { retryWhen, retryTimes, delay = 0 } = options;

    if (retryWhen && retryWhen()) {
      await wait(delay);
      return retryPromise(fn, options);
    } else if (retryTimes && retryTimes > 0) {
      await wait(delay);
      return retryPromise(fn, { ...options, retryTimes: retryTimes - 1 });
    }

    throw e;
  }
};

export default retryPromise;
