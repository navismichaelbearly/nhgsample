/* eslint-disable */
import { getWindowOrigin } from 'nhh-styles';

import { arrearsBaseRoute, arrearsClientId } from './constants/tokens';
import devElse from './util/devElse';

export default {
  requireTenant: true,
  closable: true,
  apiTokenCallbackUrl: devElse(
    `${getWindowOrigin()}/callback.html`,
    `${getWindowOrigin()}${arrearsBaseRoute}/callback.html`
  ),
  auth: {
    redirectUrl: devElse(getWindowOrigin(), `${getWindowOrigin()}${arrearsBaseRoute}`),
  },
  clientId: devElse('7S4DP6HaTH5htG72ZqDOC3tONqK1yG62', arrearsClientId),
  configurationBaseUrl: 'https://cdn.eu.auth0.com',
  overrides: {
    __tenant: devElse('nhh-dev', '#{Auth0.Core.TenantName}'),
    __token_issuer: devElse(
      'https://login-dev.workwise.london/',
      'https://#{Auth0.Core.Authority}/',
    ),
  },
  domain: devElse('login-dev.workwise.london', '#{Auth0.Core.Authority}'),
  id: 'arrears-spa',
  ssoCallbackUrl: devElse(
    `${getWindowOrigin()}/callback.html`,
    `${getWindowOrigin()}${arrearsBaseRoute}/callback.html`
  ),
};
