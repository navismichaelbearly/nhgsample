import * as sendCorrespondenceActions from '../../ducks/sendCorrespondence';
import * as modalActions from '../../ducks/modal';
import * as actions from '../../ducks/ribbon';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('SendCorrespondence connector', () => {
  let mockState;
  let mapStateToPropsResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      bar: 'baz',
      history: {
        push: jest.fn(),
      },
      match: {
        params: {
          arrearsId: 'foo',
        },
      },
    };
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      mapStateToPropsResult = mapStateToProps(mockState, ownProps);
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let result;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(() => ({ catch: () => {}, then: cb => cb })),
      };
      actions.updateRibbon = jest.fn();
      sendCorrespondenceActions.getTemplates = jest.fn();
      sendCorrespondenceActions.resetData = jest.fn();
      sendCorrespondenceActions.setFormData = jest.fn();
      modalActions.setModalContent = jest.fn();
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });

    it('performs the correct actions for updatePageHeader', () => {
      result.updatePageHeader();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(actions.updateRibbon).toHaveBeenCalled();
    });

    it('performs the correct actions for getTemplates', () => {
      const recipient = 'asd';
      result.getTemplates(recipient);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(sendCorrespondenceActions.getTemplates).toHaveBeenCalledWith(recipient, {
        businessUnit: mockState.arrears.items[0].businessUnit,
      });
    });

    it('performs the correct actions for openTemplate', () => {
      const template = 'template content';
      result.openTemplate(template);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(modalActions.setModalContent).toHaveBeenCalledWith(template);
    });

    it('performs the correct actions for closeTemplate', () => {
      result.closeTemplate();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(modalActions.setModalContent).toHaveBeenCalled();
    });

    it('performs the correct actions for onNext', () => {
      const params = { a: 'b' };
      result.onNext(params);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(sendCorrespondenceActions.setFormData).toHaveBeenCalledWith(params);
    });

    it('performs the correct actions for resetData', () => {
      result.resetData();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(sendCorrespondenceActions.resetData).toHaveBeenCalled();
    });
  });
});
