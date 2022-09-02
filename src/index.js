import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';

import { initAuthSdk, loadBaseStyles } from 'nhh-styles';

import { Provider } from 'react-redux';

import formSdk from './util/formSdk';

import {
  activitiesApi,
  arrearsApi,
  arrearsApiV2,
  correspondenceApi,
  customerApi,
  interactionsApi,
  documentsApi,
  notesApi,
  paymentsApi,
  tasksApi,
  tasksApiV2,
  sharepointApi,
  identityApi,
  linkedCasesApi,
} from './api';
import authConfig from './authConfig';

import { arrearsBaseRoute } from './constants/tokens';
import devElse from './util/devElse';

import dictionary from './constants/dictionary';

import {
  getHoProfile,
  initialised,
  loginSuccess,
  setProfile,
  startWaiting,
  stopWaiting,
  logout,
} from './ducks/user';
import { getCustomerProfile } from './ducks/customer';
import { loadStrings } from './ducks/dictionary';
import { loadFeatures } from './ducks/features';
import { formSubmitted, setError } from './ducks/forms';
import store from './ducks';

import { App } from './compositions';

import './index.css';

const {
  api: { address, forms, submissions },
} = formSdk;

loadBaseStyles();

store.dispatch(loadStrings(dictionary()));
store.dispatch(loadFeatures());

formSdk.on('submit', () => store.dispatch(formSubmitted()));
formSdk.on('error', () => store.dispatch(setError()));

initAuthSdk({
  authConfig,
  store,
  assignTokens: {
    'nhh:api': [
      activitiesApi.api,
      arrearsApi.api,
      arrearsApiV2.api,
      correspondenceApi.api,
      customerApi.api,
      interactionsApi.api,
      linkedCasesApi.api,
      notesApi.api,
      tasksApi.api,
      tasksApiV2.api,
    ],
    'nhh:profileapi': [identityApi.api],
    'nhh:documentsapi': [documentsApi.api, sharepointApi.api],
    'nhh:addresssearchapi': [address.instance],
    'nhh:formsapi': [forms.instance, submissions.instance],
    'nhh:paymentsapi': [paymentsApi.api],
  },
  events: {
    getCustomerProfile,
    getHoProfile,
    loginSuccess,
    setProfile,
    startWaiting,
    stopWaiting,
    initialised,
    logout,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <Router basename={devElse('/', arrearsBaseRoute)}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
