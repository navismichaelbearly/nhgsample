import { mapStateToProps } from './connect';
import state from '../../../__mocks__/state';

jest.mock('moment', () => ({
  utc: () => ({
    subtract: () => ({
      format: () => '2017-07-30',
    }),
  }),
}));

describe('TenancyTransactions connect', () => {
  let mockState;
  let mapStateToPropsResult;

  beforeEach(() => {
    mockState = state();
    mapStateToPropsResult = mapStateToProps(mockState);
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
  });
});
