import * as actions from '../../ducks/ribbon';
import * as formActions from '../../ducks/forms';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

jest.mock('uuid/v4', () => () => 'hi-im-a-uuid');

describe('CreateLegalCaseReferral connector', () => {
  let mockState;
  let mapStateToPropsResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      bar: 'baz',
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
        dispatch: jest.fn(),
      };
      actions.updateRibbon = jest.fn();
      formActions.createSubmission = jest.fn();
      formActions.generateNewSubmissionId = jest.fn();
      formActions.clearSubmissions = jest.fn();
      formActions.setFormRendered = jest.fn();
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

    it('performs the correct actions for generateNewSubmissionId', () => {
      result.generateNewSubmissionId();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(formActions.generateNewSubmissionId).toHaveBeenCalledWith(
        'legalReferralCaseFormName',
        'foo'
      );
    });

    it('performs the correct actions for clearSubmissions', () => {
      result.clearSubmissions();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(formActions.clearSubmissions).toHaveBeenCalledWith('legalReferralCaseFormName');
    });

    it('performs the correct actions for setFormRendered', () => {
      result.setFormRendered();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(formActions.setFormRendered).toHaveBeenCalled();
    });

    it('performs the correct actions for createSubmission', () => {
      result.createSubmission();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(formActions.createSubmission).toHaveBeenCalledWith('legalReferralCaseFormName', 'foo');
    });
  });
});
