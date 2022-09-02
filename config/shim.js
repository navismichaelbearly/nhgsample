import matchMediaPolyfill from 'mq-polyfill';

matchMediaPolyfill(window);

global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0);
};

global.localStorage = {
  getItem: () => null,
  setItem: () => null,
};

global.sessionStorage = {
  removeItem: () => null,
};
