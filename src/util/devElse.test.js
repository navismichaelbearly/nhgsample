import devElse from './devElse';

describe('devElse', () => {
  const env = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = env;
  });

  describe('NODE_ENV is not set', () => {
    it('returns production string', () => {
      delete process.env.NODE_ENV;
      expect(devElse('dev', 'prod')).toBe('prod');
    });
  });

  describe('NODE_ENV development', () => {
    it('returns development string', () => {
      process.env.NODE_ENV = 'development';
      expect(devElse('dev', 'prod')).toBe('dev');
    });
  });

  describe('NODE_ENV <other>', () => {
    it('returns production string', () => {
      process.env.NODE_ENV = 'fiddlesticks';
      expect(devElse('dev', 'prod')).toBe('prod');
    });
  });
});
