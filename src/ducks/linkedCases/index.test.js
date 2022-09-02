import { linkedCasesApi } from '../../api';

import reducer, {
  loadLinkedCases,
  SET_LINKEDCASES,
  SET_LINKEDCASES_LOADING,
  SET_LINKEDCASES_LOADED_SUCCESS,
  SET_LINKEDCASES_LOADED_ERROR,
} from './';

jest.mock('../../api', () => ({
  linkedCasesApi: {
    getLinkedCasesById: jest.fn(),
  },
}));

describe('reducer', () => {
  it('SET_LINKEDCASES_LOADING matches expected state', () => {
    const state = {
      unrelatedProp: 'unrelatedPropValue',
      linkedCasesLoading: 'linkedCasesLoadingValue',
      linkedCasesLoadingError: 'linkedCasesLoadingErrorValue',
    };
    expect(reducer(state, { type: SET_LINKEDCASES_LOADING })).toEqual({
      unrelatedProp: 'unrelatedPropValue',
      linkedCasesLoading: true,
      linkedCasesLoadingError: false,
    });
  });
  it('SET_LINKEDCASES_LOADED_SUCCESS matches expected state', () => {
    const state = {
      unrelatedProp: 'unrelatedPropValue',
      linkedCasesLoading: 'linkedCasesLoadingValue',
      linkedCasesLoadingError: 'linkedCasesLoadingErrorValue',
    };
    expect(reducer(state, { type: SET_LINKEDCASES_LOADED_SUCCESS })).toEqual({
      unrelatedProp: 'unrelatedPropValue',
      linkedCasesLoading: false,
      linkedCasesLoadingError: false,
    });
  });
  it('SET_LINKEDCASES_LOADED_ERROR matches expected state', () => {
    const state = {
      unrelatedProp: 'unrelatedPropValue',
      linkedCasesLoading: 'linkedCasesLoadingValue',
      linkedCasesLoadingError: 'linkedCasesLoadingErrorValue',
    };
    expect(reducer(state, { type: SET_LINKEDCASES_LOADED_ERROR })).toEqual({
      unrelatedProp: 'unrelatedPropValue',
      linkedCasesLoading: false,
      linkedCasesLoadingError: true,
    });
  });
  describe('SET_LINKEDCASES', () => {
    it('matches expected final state when payload is defined', () => {
      const state = {
        unrelatedProp: 'unrelatedPropValue',
      };
      const action = {
        type: SET_LINKEDCASES,
        payload: [],
      };
      expect(reducer(state, action)).toEqual({
        unrelatedProp: 'unrelatedPropValue',
        linkedCases: [],
      });
    });
    it('matches expected final state when payload is undefined', () => {
      const state = {
        unrelatedProp: 'unrelatedPropValue',
      };
      const action = {
        type: SET_LINKEDCASES,
      };
      expect(reducer(state, action)).toEqual({
        unrelatedProp: 'unrelatedPropValue',
        linkedCases: [],
      });
    });
  });
});

describe('loadLinkedCases', () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
  });
  describe('when successful', () => {
    let caseId;
    beforeEach(() => {
      linkedCasesApi.getLinkedCasesById.mockImplementation(() =>
        Promise.resolve({ data: { caseId: '1', title: 'abc' } })
      );
      caseId = 'caseIdSample';
    });
    it('dispatches SET_LINKEDCASES_LOADING', () =>
      loadLinkedCases(caseId)(dispatch).then(() => {
        expect(dispatch).toHaveBeenCalledWith({ type: SET_LINKEDCASES_LOADING });
      }));
    it('dispatches SET_LINKEDCASES', () =>
      loadLinkedCases(caseId)(dispatch).then(() => {
        expect(linkedCasesApi.getLinkedCasesById).toHaveBeenCalledWith('caseIdSample');
        expect(dispatch).toHaveBeenCalledWith({
          type: SET_LINKEDCASES,
          payload: { caseId: '1', title: 'abc' },
        });
      }));
  });
  describe('when failing', () => {
    let caseId;
    beforeEach(() => {
      linkedCasesApi.getLinkedCasesById.mockImplementation(() => Promise.reject('error'));
      caseId = 'caseIdSample';
    });
    it('dispatches SET_LINKEDCASES_LOADING', () =>
      loadLinkedCases(caseId)(dispatch).then(() => {
        expect(dispatch).toHaveBeenCalledWith({ type: SET_LINKEDCASES_LOADING });
      }));
    it('dispatches SET_LINKEDCASES', () =>
      loadLinkedCases(caseId)(dispatch).then(() => {
        expect(linkedCasesApi.getLinkedCasesById).toHaveBeenCalledWith('caseIdSample');
        expect(dispatch).toHaveBeenCalledWith({
          type: SET_LINKEDCASES,
          payload: undefined,
        });
      }));
  });
  describe('when failing with 404', () => {
    let caseId;
    beforeEach(() => {
      linkedCasesApi.getLinkedCasesById.mockImplementation(() =>
        Promise.reject({ response: { status: 404 } })
      );
      caseId = 'caseIdSample';
    });
    it('dispatches SET_LINKEDCASES_LOADING', () =>
      loadLinkedCases(caseId)(dispatch).then(() => {
        expect(dispatch).toHaveBeenCalledWith({ type: SET_LINKEDCASES_LOADING });
      }));
    it('dispatches SET_LINKEDCASES', () =>
      loadLinkedCases(caseId)(dispatch).then(() => {
        expect(linkedCasesApi.getLinkedCasesById).toHaveBeenCalledWith('caseIdSample');
        expect(dispatch).toHaveBeenCalledWith({
          type: SET_LINKEDCASES,
          payload: undefined,
        });
      }));
  });
});
