import { mergeProps, mapStateToProps } from './connect';

import state from '../../../__mocks__/state';

describe('mapStateToprops', () => {
  let ownProps;
  let mockState;

  beforeEach(() => {
    mockState = state();
  });

  describe('mapStateToProps', () => {
    let stateProps;

    it('should render correct props', () => {
      stateProps = mapStateToProps(mockState);

      expect(stateProps).toMatchSnapshot();
    });

    describe('mergeProps', () => {
      let dispatchProps;

      beforeEach(() => {
        dispatchProps = {
          dispatch: jest.fn(),
        };

        ownProps = {};
      });

      it('should render correct props', () => {
        expect(mergeProps(stateProps, dispatchProps, ownProps)).toMatchSnapshot();
      });
    });
  });
});
