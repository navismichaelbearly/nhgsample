import { compareRoles, getRoles, getPermissions, isUserSeniorManager } from './userRoles';

describe('userRoles', () => {
  describe('compareRoles', () => {
    it('returns true when A > B', () => {
      const aRoles = ['StandardUser', 'HousingOfficer', 'Manager', 'SeniorManager'];
      const bRoles = ['StandardUser', 'HousingOfficer', 'Manager'];
      expect(compareRoles(aRoles, bRoles)).toEqual(true);
    });
    it('returns true when A = B', () => {
      const aRoles = ['StandardUser', 'HousingOfficer', 'Manager'];
      const bRoles = ['StandardUser', 'HousingOfficer', 'Manager'];
      expect(compareRoles(aRoles, bRoles)).toEqual(true);
    });
    it('returns false when A < B', () => {
      const aRoles = ['StandardUser', 'HousingOfficer'];
      const bRoles = ['StandardUser', 'HousingOfficer', 'Manager'];
      expect(compareRoles(aRoles, bRoles)).toEqual(false);
    });
    it('returns true when comparing StandardUser and HousingOfficer', () => {
      const aRoles = ['StandardUser'];
      const bRoles = ['HousingOfficer'];
      expect(compareRoles(aRoles, bRoles)).toEqual(true);
    });
    it('returns true when comparing StandardUser and HousingOfficer', () => {
      const aRoles = ['StandardUser'];
      const bRoles = [];
      expect(compareRoles(aRoles, bRoles)).toEqual(true);
    });
  });
  describe('getRoles', () => {
    it('returns roles when roles is defined', () => {
      const claims = { 'http://nhhg.org.uk/claims/roles': ['a', 'b'] };
      expect(getRoles(claims)).toEqual(['a', 'b']);
    });
    it('returns empty array when roles is not defined', () => {
      const claims = {};
      expect(getRoles(claims)).toEqual([]);
    });
    it('returns undefined when claims is not defined', () => {
      expect(getRoles()).toEqual([]);
    });
  });
  describe('getPermissions', () => {
    it('returns permissions when permissions is defined', () => {
      const claims = { 'http://nhhg.org.uk/claims/permissions': ['a', 'b'] };
      expect(getPermissions(claims)).toEqual(['a', 'b']);
    });
    it('returns undefined when permissions is not defined', () => {
      const claims = {};
      expect(getPermissions(claims)).toEqual(undefined);
    });
    it('returns undefined when claims is not defined', () => {
      expect(getPermissions()).toEqual(undefined);
    });
  });
  describe('isUserSeniorManager', () => {
    it('returns true when user has SeniorManager role', () => {
      const roles = ['RoleA', 'RoleB', 'SeniorManager'];
      expect(isUserSeniorManager(roles)).toBe(true);
    });
    it('returns true when user does not have SeniorManager role', () => {
      const roles = ['RoleA', 'RoleB', 'RoleC'];
      expect(isUserSeniorManager(roles)).toBe(false);
    });
    it('returns true when user roles is empty', () => {
      const roles = [];
      expect(isUserSeniorManager(roles)).toBe(false);
    });
    it('returns true when user roles is undefined', () => {
      expect(isUserSeniorManager()).toBe(false);
    });
  });
});
