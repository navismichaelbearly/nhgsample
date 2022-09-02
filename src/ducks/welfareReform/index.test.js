import * as apis from '../../api';
import reducer, { getWelfareReform, setWelfareReform, SET_WELFARE_REFORM } from './';

jest.mock('../../api', () => ({
  customerApi: {
    getWelfareReform: id => ({
      data: { tenancyID: id },
    }),
    patchWelfareReform: id => ({
      data: { tenancyID: id },
    }),
  },
}));

describe('get', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  it('should set welfare reform', () => {
    const welfareReform = {};
    const result = reducer({}, setWelfareReform(welfareReform));
    expect(result.welfareReform).toBe(welfareReform);
  });

  describe('Given a tenancy id', () => {
    const tenancyId = 'ABCD';
    const welfareReform = {};

    beforeEach(async () => {
      apis.customerApi.getWelfareReformDetails = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ data: welfareReform }));
      await getWelfareReform(tenancyId)(dispatch);
    });

    it('should call the `getWelfareReformDetails` api with the tenancy id', () => {
      expect(apis.customerApi.getWelfareReformDetails).toHaveBeenCalledWith(tenancyId);
    });

    it('should set welfare reform', () => {
      expect(dispatch).toHaveBeenCalledWith({
        payload: { welfareReform },
        type: SET_WELFARE_REFORM,
      });
    });
  });
});
