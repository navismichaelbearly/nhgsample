import compose from 'ramda/src/compose';
import last from 'ramda/src/last';
import path from 'ramda/src/path';
import pathOr from 'ramda/src/pathOr';
import pickAll from 'ramda/src/pickAll';
import prop from 'ramda/src/prop';

import { customerDashboard, employeeDashboard } from '../constants/routes';

const HO_PREFIX = 'housingOfficer';
const CU_PREFIX = 'customer';

const getFromObj = obj => (key, or = undefined) => pathOr(or, key, obj);
const capitalise = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

function getHelpers(state) {
  const get = getFromObj(state);
  const dictionary = get(['dictionary']);
  const isHousingOfficer = get(['user', 'profile', 'isHousingOfficer']);
  const prefix = isHousingOfficer ? HO_PREFIX : CU_PREFIX;

  const pickFrom = (items, stateProperty) => {
    if (typeof items === 'object' && typeof stateProperty === 'string') {
      return pickAll(items, prop(stateProperty, state));
    }
    return null;
  };

  const getString = key => {
    if (typeof key === 'string') {
      return key;
    }

    const str = path(key, dictionary);
    if (str) {
      return str;
    }

    const prefixedKey = key.slice(0, key.length - 1);
    prefixedKey.push(`${prefix}${compose(capitalise, last)(key)}`);
    return path(prefixedKey, dictionary);
  };

  const getBreadcrumbs = (key, customerProfile = {}, otherCrumbs) => {
    const { dashboard, arrearsDashboard } = dictionary;
    const arrearsSegment = arrearsDashboard[`${prefix}Heading`];
    const crumbLabel = key ? getString(key) : null;

    let crumbs = [];
    if (isHousingOfficer && customerProfile.id && customerProfile.fullName) {
      crumbs.push({
        label: customerProfile.fullName,
        href: customerProfile.id
          ? `${employeeDashboard}/customer/${customerProfile.id}`
          : customerDashboard,
        id: 'breadcrumb-customerName',
      });
    } else if (crumbLabel !== arrearsSegment) {
      crumbs.push({
        label: arrearsSegment,
        to: '/',
        id: 'breadcrumb-arrearsDashboard',
      });
    }

    if (Array.isArray(otherCrumbs)) {
      crumbs = crumbs.concat(otherCrumbs);
    } else if (otherCrumbs) {
      crumbs.push(otherCrumbs);
    }

    if (crumbLabel) {
      crumbs.push({ label: crumbLabel, id: `breadcrumb-${crumbLabel}` });
    }

    const breadCrumb = [
      {
        label: dashboard,
        href: isHousingOfficer ? employeeDashboard : customerDashboard,
        id: 'breadcrumb-dashboard',
      },
      ...crumbs,
    ];

    return breadCrumb.filter(item => item);
  };

  return {
    get,
    getString,
    dictionary,
    isHousingOfficer,
    getBreadcrumbs,
    pickFrom,
  };
}

export default getHelpers;
export { getFromObj };
