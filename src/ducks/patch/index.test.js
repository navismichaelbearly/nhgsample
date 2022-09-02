import * as apis from '../../api';
import reducer, {
  getTeamMembers,
  hidePatchSelect,
  setPatchList,
  setTeamMembers,
  showPatchSelect,
  SET_TEAM_MEMBERS,
} from './';

describe('patch', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  it('should set shown patch select state', () => {
    const result = reducer({}, showPatchSelect());
    expect(result.visible).toBe(true);
  });

  it('should set hidden patch select state', () => {
    const result = reducer({}, hidePatchSelect());
    expect(result.visible).toBe(false);
  });

  describe('When setting the patch list', () => {
    let patchList;
    let result;
    let localStorageSetItemSpy;

    beforeEach(() => {
      patchList = [{}, {}];
      localStorageSetItemSpy = jest.spyOn(global.localStorage, 'setItem');
      result = reducer({}, setPatchList(patchList));
    });

    afterEach(() => {
      localStorageSetItemSpy.mockReset();
      localStorageSetItemSpy.mockRestore();
    });

    it('should set the patch list', () => {
      expect(result.patchList).toBe(patchList);
    });
  });

  it('should set the team members', () => {
    const teamMembers = [{}, {}, {}, {}];
    const result = reducer({}, setTeamMembers(teamMembers));
    expect(result.teamMembers).toBe(teamMembers);
  });

  describe('Given a team id', () => {
    const teamId = 'ABCD';
    const teamMembers = [{}, {}, {}, {}];

    beforeEach(async () => {
      apis.customerApi.getTeamMembersByTeamId = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ data: teamMembers }));
      await getTeamMembers(teamId)(dispatch);
    });

    it('should call the `getTeamMembersByTeamId` api with the team id', () => {
      expect(apis.customerApi.getTeamMembersByTeamId).toHaveBeenCalledWith(teamId);
    });

    it('should set the team members', () => {
      expect(dispatch).toHaveBeenCalledWith({
        payload: { teamMembers },
        type: SET_TEAM_MEMBERS,
      });
    });
  });
});
