import { roles, permissions } from '../constants/claims';

export const weights = {
  StandardUser: 1,
  HousingOfficer: 1,
  Manager: 2,
  SeniorManager: 3,
};

export const compareRoles = (a = [], b = []) =>
  Math.max(...a.map(item => weights[item])) >= Math.max(...b.map(item => weights[item]));

export const getRoles = (claims = {}) => claims[roles] || [];

export const getPermissions = (claims = {}) => claims[permissions];

export const isUserSeniorManager = (userRoles = []) => userRoles.includes('SeniorManager');
