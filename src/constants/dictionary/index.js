import test from './test-LANG';
import enGB from './en-GB';

const languages = {
  test,
  'en-GB': enGB,
};

export default lang => languages[lang] || languages['en-GB'];
