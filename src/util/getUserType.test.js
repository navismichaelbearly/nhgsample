import getUserType from './getUserType';
import { permissions, userType } from '../constants/claims';

describe('getUserType', () => {
  it('sets userType to empty string as default', () => {
    expect(getUserType()).toBe('');
  });

  it('sets userType to `manager` if manager conditions are met', () => {
    expect(getUserType({ [permissions]: ['ARREARS.ApprovePauseRequest'] })).toBe('manager');
  });

  it('sets userType to value of userType claim if exists and no other conditions are met', () => {
    expect(getUserType({ [userType]: 'foo', [permissions]: [] })).toBe('foo');
  });
});
