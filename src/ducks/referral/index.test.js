import reducer, {
  createReferralCase,
  getReferralTeams,
  initialState,
  REFERRAL_CASE_CREATED,
  SET_REFERRAL_TEAMS,
  REFERRAL_CASE_LOADING,
  setReferralTeams,
  REFERRAL_CASE_ERROR,
} from './';
import { arrearsApi } from '../../api';

const referrableTeamspayload = {
  referrableTeams: [
    {
      id: 'rt-1',
      name: 'Benefits advice',
    },
    {
      id: 'rt-2',
      name: 'Tenancy support',
    },
  ],
};

jest.mock('../../api', () => ({
  arrearsApi: {
    createReferralCase: id =>
      id === 'fail'
        ? Promise.reject({ status: 500, data: { message: 'this is a dummy message' } })
        : { status: 200, data: { id, bar: 'baz' } },
    getReferralTeams: jest.fn(() => ({
      data: {
        referrableTeams: [
          {
            id: 'rt-1',
            name: 'Benefits advice',
          },
          {
            id: 'rt-2',
            name: 'Tenancy support',
          },
        ],
      },
    })),
  },
}));

describe('referral reducer', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set a default state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should set referral teams', () => {
    const result = reducer(undefined, setReferralTeams(referrableTeamspayload));
    expect(result.referralTeams).toEqual(referrableTeamspayload.referrableTeams);
  });

  it('should set referral teams when getReferralTeams is called', async () => {
    await getReferralTeams()(dispatch);
    expect(dispatch).toBeCalledWith({
      payload: referrableTeamspayload,
      type: SET_REFERRAL_TEAMS,
    });
  });

  it('should have passed arrears as category to the getReferralTeams API call', async () => {
    await getReferralTeams()(dispatch);

    expect(arrearsApi.getReferralTeams).toBeCalledWith('arrears');
  });

  it('should update store when createReferralCase is called', async () => {
    await createReferralCase('caseId', {})(dispatch);
    expect(dispatch).toBeCalledWith({
      type: REFERRAL_CASE_LOADING,
    });
    expect(dispatch).toBeCalledWith({
      type: REFERRAL_CASE_CREATED,
      payload: { data: { bar: 'baz', id: 'caseId' }, status: 200 },
    });
  });

  it('should update store when createReferralCase is called with an error', async () => {
    try {
      await createReferralCase('fail', {})(dispatch);
      expect(dispatch).toBeCalledWith({
        type: REFERRAL_CASE_LOADING,
      });
      expect(dispatch).toBeCalledWith({
        type: REFERRAL_CASE_ERROR,
      });
    } catch (err) {
      expect(err).toBeGreaterThan(400);
    }
  });
});
