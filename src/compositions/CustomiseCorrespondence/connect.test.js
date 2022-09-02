import * as sendCorrespondence from '../../ducks/sendCorrespondence';
import * as modalActions from '../../ducks/modal';
import * as actions from '../../ducks/ribbon';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';
import * as mediaActions from '../../ducks/media';

describe('CustomiseCorrespondence connector', () => {
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
          correspondenceId: 'bar',
        },
      },
      history: { push: jest.fn() },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
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
        dispatch: jest.fn(fn => fn),
      };
      mediaActions.uploadMediaFile = jest.fn((type, id, payload) =>
        type === 'fail'
          ? Promise.reject({ response: { status: 500 } })
          : Promise.resolve({ data: { id, type, payload } })
      );
      mediaActions.getFilesByCaseId = jest.fn();
      actions.updateRibbon = jest.fn();
      sendCorrespondence.getTemplatesSubstitutions = jest.fn();
      sendCorrespondence.generatePreviewCorrespondence = jest.fn();
      sendCorrespondence.getCorrespondenceDocument = jest.fn();
      sendCorrespondence.resetData = jest.fn();
      sendCorrespondence.submitAPI = jest.fn((id, payload) =>
        payload === 'fail'
          ? Promise.reject({ response: { status: 500 } })
          : Promise.resolve({ data: { id, payload } })
      );
      modalActions.setModalContent = jest.fn();
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });

    it('performs the correct actions for updatePageHeader', () => {
      result.updatePageHeader();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(actions.updateRibbon).toHaveBeenCalled();
    });

    it('performs the correct actions for generateDraft', () => {
      const params = { a: 'b' };
      result.generateDraft(params);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(sendCorrespondence.generatePreviewCorrespondence).toHaveBeenCalledWith(
        ownProps.match.params.correspondenceId,
        params,
        sendCorrespondence.getCorrespondenceDocument
      );
    });

    it('performs the correct actions for getSubstitutionFields', () => {
      const templateId = 'asd';
      result.getSubstitutionFields(templateId);
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(sendCorrespondence.getTemplatesSubstitutions).toHaveBeenCalledWith(templateId);
    });

    it('performs the correct actions for openTemplate', () => {
      const template = 'template content';
      result.openTemplate({ template, limitMaxWidth: true });
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(modalActions.setModalContent.mock.calls).toMatchSnapshot();
    });

    it('performs the correct actions for closeTemplate', () => {
      result.closeTemplate();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(modalActions.setModalContent).toHaveBeenCalled();
    });

    it('performs the correct actions for onUnmount', () => {
      result.onUnmount();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(sendCorrespondence.resetData).toHaveBeenCalled();
    });

    describe('attachments props', () => {
      it('performs the correct actions for onChange', () => {
        const file = { name: 'hello' };
        result.attachmentProps.onChange(file);
        expect(dispatchProps.dispatch).toHaveBeenCalledWith({
          payload: file,
          type: mediaActions.ADD_PENDING_MEDIA_UPLOAD,
        });
      });

      it('performs the correct actions for clearMediaState', () => {
        result.attachmentProps.clearMediaState();
        expect(dispatchProps.dispatch).toHaveBeenCalledWith({
          type: mediaActions.CLEAR_MEDIA_STATE,
        });
      });

      it('performs the correct actions for onRemove', () => {
        const file = { name: 'hello' };
        result.attachmentProps.onRemove(file);
        expect(dispatchProps.dispatch).toHaveBeenCalledWith({
          payload: file,
          type: mediaActions.REMOVE_PENDING_MEDIA_UPLOAD,
        });
      });

      it('performs the correct actions for onSubmit when there are media files', () => {
        const payload = {
          exstingDocumentUrlsToAttach: [],
          printer: { printerId: 'thisIsAPrinterId' },
        };
        result = mergeProps(
          {
            ...mapStateToPropsResult,
            attachmentProps: {
              ...mapStateToPropsResult.attachmentProps,
              pendingFiles: ['thisIsAFileURI'],
            },
          },
          dispatchProps,
          ownProps
        );
        result.onSubmit(payload);
        expect(mediaActions.uploadMediaFile).toHaveBeenCalledWith(
          'correspondence',
          ownProps.match.params.correspondenceId,
          'thisIsAFileURI'
        );
      });

      it('performs the correct actions for onSubmit', async () => {
        const payload = {
          exstingDocumentUrlsToAttach: [],
          printer: { printerId: 'thisIsAPrinterId' },
        };
        await result.onSubmit(payload);
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(sendCorrespondence.submitAPI).toHaveBeenCalledWith(
          ownProps.match.params.correspondenceId,
          payload
        );
        expect(dispatchProps.dispatch).toHaveBeenCalledWith({
          payload: {
            dataBddPrefix: 'correspondence-sent',
            icon: 'success',
            notificationType: 'confirmation',
            title: 'Correspondence sent',
          },
          type: 'notification/ADD',
        });
      });

      it('performs the correct actions for onRetry', () => {
        const file = { name: 'hello' };
        result.attachmentProps.onRetry(file);
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(mediaActions.uploadMediaFile).toHaveBeenCalledWith(
          'correspondence',
          ownProps.match.params.correspondenceId,
          file
        );
      });

      it('performs the correct actions for getFilesByCaseId', () => {
        result.attachmentProps.getFilesByCaseId();
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(mediaActions.getFilesByCaseId).toHaveBeenCalledWith(ownProps.match.params.arrearsId);
      });
    });
  });
});
