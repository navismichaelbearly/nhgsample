// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');

const isDev = process.env.NODE_ENV === 'development';

module.exports = new HtmlWebpackPlugin({
  inject: false,
  domain: isDev ? 'login-dev.workwise.london' : '#{Auth0.Core.Authority}',
  clientID: isDev ? '7S4DP6HaTH5htG72ZqDOC3tONqK1yG62' : '#{Arrears.SPA.Auth0ClientId}',
  filename: 'callback.html',
  template: paths.callbackHtml,
});
