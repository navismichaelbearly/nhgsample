import getArrearsStages from './getArrearsStages';

describe('getArrearsStages', () => {
  let result;

  describe('Given a profile', () => {
    let arrearStatuses;

    beforeEach(() => {
      arrearStatuses = {
        All: {
          count: 17,
          id: null,
          products: [
            {
              product: 'This is a stage Category',
              stages: [
                { id: 'id type 1', name: 'this is another stage', count: 1 },
                {
                  id: 'this is another stage id',
                  name: 'this is a stage name',
                  count: 3,
                },
              ],
            },
            {
              product: 'This is a stage Category',
              stages: [{ id: 'id type 1', name: 'this is another stage', count: 1 }],
            },
            {
              product: 'This is a stage Category',
              stages: [
                {
                  id: 'this is another stage id',
                  name: 'this is a stage name',
                  count: 1,
                },
              ],
            },
            {
              product: 'This is a stage Category',
              stages: [
                {
                  id: 'this is another stage id',
                  name: 'this is a stage name',
                  count: 1,
                },
              ],
            },
            {
              product: 'This is a stage Category',
              stages: [
                {
                  id: 'this is another stage id',
                  name: 'this is a stage name',
                  count: 1,
                },
              ],
            },
            {
              product: 'This is a stage Category',
              stages: [
                {
                  id: 'this is another stage id',
                  name: 'this is a stage name',
                  count: 3,
                },
              ],
            },
            {
              product: 'This is a stage Category',
              stages: [
                {
                  id: 'this is another stage id',
                  name: 'this is a stage name',
                  count: 1,
                },
                { id: 'id type 1', name: 'this is another stage', count: 1 },
                {
                  id: 'this is a very different stage id',
                  name: 'one of the stages please',
                  count: 1,
                },
              ],
            },
            {
              product: 'This is a stage Category',
              stages: [
                {
                  id: 'this is another stage id',
                  name: 'this is a stage name',
                  count: 2,
                },
                { id: 'id type 1', name: 'this is another stage', count: 1 },
              ],
            },
          ],
        },
      };
      result = getArrearsStages('All', arrearStatuses, {
        allStages: 'All Stages',
        arrears: 'Arrears - {status} ({count})',
        arrearsByStage: '\u00A0\u00A0\u00A0\u00A0{stage} ({count})',
      });
    });

    it('should get the patch info', () => {
      expect(result).toEqual([
        { label: 'All Stages', value: '' },
        { disabled: true, label: 'This is a stage Category', value: null },
        {
          count: 4,
          id: 'this is another stage',
          label: '    this is another stage (4)',
          name: 'this is another stage',
          product: 'This is a stage Category',
          value: 'id type 1',
        },
        {
          count: 12,
          id: 'this is a stage name',
          label: '    this is a stage name (12)',
          name: 'this is a stage name',
          product: 'This is a stage Category',
          value: 'this is another stage id',
        },
        {
          count: 1,
          id: 'one of the stages please',
          label: '    one of the stages please (1)',
          name: 'one of the stages please',
          product: 'This is a stage Category',
          value: 'this is a very different stage id',
        },
      ]);
    });
  });
});
