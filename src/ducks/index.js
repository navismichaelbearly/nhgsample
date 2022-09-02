import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { enableReduxDevtool } from 'nhh-styles';

import activities from './activities';
import arrears from './arrears';
import sendCorrespondence from './sendCorrespondence';
import customer from './customer';
import dictionary from './dictionary';
import features from './features';
import forms from './forms';
import housingofficersearch from './housingofficersearch';
import interactions from './interactions';
import legalReferral from './legalReferral';
import linkedCases from './linkedCases';
import media from './media';
import modal from './modal';
import navigation from './navigation';
import notes from './notes';
import notifications from './notifications';
import patch from './patch';
import pause from './pause';
import paymentPlan from './paymentPlan';
import referral from './referral';
import ribbon from './ribbon';
import tasks from './tasks';
import tenancy from './tenancy';
import user from './user';
import welfareReform from './welfareReform';

export const reducers = combineReducers({
  activities,
  arrears,
  sendCorrespondence,
  customer,
  dictionary,
  features,
  forms,
  housingofficersearch,
  interactions,
  legalReferral,
  linkedCases,
  media,
  modal,
  navigation,
  notes,
  notifications,
  patch,
  pause,
  paymentPlan,
  referral,
  ribbon,
  tasks,
  tenancy,
  user,
  welfareReform,
});

const storeEnhancer = compose(applyMiddleware(thunk), enableReduxDevtool);

export default createStore(reducers, storeEnhancer);
