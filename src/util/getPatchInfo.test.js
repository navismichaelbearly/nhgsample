import getPatchInfo from './getPatchInfo';

jest.mock('./devElse', () => () => 'https://url/with/$id/image.jpg');

describe('getPatchInfo', () => {
  let result;

  describe('Given a profile', () => {
    let profile;

    beforeEach(() => {
      profile = {
        fullname: 'Amorita Holly',
        id: '123456',
        patchName: 'CABBAGE',
      };
      result = getPatchInfo(profile);
    });

    it('should get the patch info', () => {
      expect(result).toEqual({
        name: profile.fullname,
        fullname: profile.fullname,
        patchName: profile.patchName,
        id: profile.id,
        src: `https://url/with/${profile.id}/image.jpg`,
      });
    });
  });
});
