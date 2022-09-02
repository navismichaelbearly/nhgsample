import { getPatchInfo, sortPatchList } from './patch';
import { avatarsApi } from '../constants/tokens';

describe('patch', () => {
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
          id: profile.id,
          patchName: profile.patchName,
          src: avatarsApi,
        });
      });
    });
  });

  describe('sortPatchList', () => {
    it('should sort patches using profile', () => {
      const profile = {
        id: 'ABC',
      };

      const patches = [
        {
          id: 'DEF',
        },
        {
          id: 'ABC123',
        },
        {
          id: 'ABC',
        },
        {
          id: 'SOMEOTHER',
        },
      ];

      sortPatchList(patches, profile);
      expect(patches).toEqual([
        {
          id: 'ABC',
        },
        {
          id: 'DEF',
        },
        {
          id: 'ABC123',
        },
        {
          id: 'SOMEOTHER',
        },
      ]);
    });
  });
});
