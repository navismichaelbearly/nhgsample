import reducer, {
  resetData,
  generatePreviewCorrespondence,
  getCorrespondenceDocument as getCorrespondenceDocumentActionCreator,
  getTemplates,
  getTemplatesSubstitutions,
  ENRICH_CORRESPONDENCE_DOCUMENT,
  SET_CORRESPONDENCE_DOCUMENTS,
  SET_GENERATE_PREVIEW_LOADING,
  SET_MANDATORY_ATTACHMENTS,
  SET_PRINTER_OPTIONS,
  SET_SUBSTITUTION_FIELDS,
  SET_TEMPLATES,
  setMandatoryAttachments,
  setPrinterOptions,
  setSubstitutionFields,
  setTemplatePreview,
  setTemplates,
  cancelCorrespondence,
  templatesLoading,
  TEMPLATES_LOADING,
  TEMPLATES_SUBSTITUTIONS_LOADING,
} from './';

jest.mock('../../api', () => ({
  correspondenceApi: {
    generatePreviewCorrespondence: () =>
      Promise.resolve({
        data: {
          documents: [
            {
              id: 'documentId',
            },
          ],
        },
      }),
    getCorrespondenceDocument: () =>
      Promise.resolve({
        data: { id: 'documentId', generationStatusModel: { dataFromServer: true } },
      }),
    cancelCorrespondence: () => Promise.resolve({ data: { hello: 'world' } }),
    getTemplates: () => Promise.resolve({ data: [1, 2] }),
    getTemplatesSubstitutions: () =>
      Promise.resolve({
        data: {
          templatePreviewImage: 'templateImage',
          substitutions: [1, 2, 3],
          mandatoryAttachments: [],
          printerOptions: {
            printerOptions: {},
          },
        },
      }),
  },
}));

describe('sendCorrespondence', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  it('should set templatesLoading state', () => {
    const result = reducer({}, templatesLoading());
    expect(result.loadingTemplates).toBe(true);
  });

  it('should set resetData state', () => {
    const result = reducer({}, resetData());
    expect(result).toMatchSnapshot();
  });

  it('should set the setMandatoryAttachments', () => {
    const mandatoryAttachments = ['a', 'b'];
    const result = reducer({}, setMandatoryAttachments(mandatoryAttachments));
    expect(result.mandatoryAttachments).toBe(mandatoryAttachments);
  });

  it('should set the setPrinterOptions', () => {
    const printerOptions = ['a', 'b'];
    const result = reducer({}, setPrinterOptions(printerOptions));
    expect(result.printerOptions).toBe(printerOptions);
  });

  it('should set the setSubstitutionFields', () => {
    const substitutionFields = ['a', 'b'];
    const result = reducer({}, setSubstitutionFields(substitutionFields));
    expect(result.loadingSubstitutions).toEqual(false);
    expect(result.substitutionFields).toEqual(substitutionFields);
  });

  it('should set the setTemplatePreview', () => {
    const templatePreview = 'asdasd';
    const result = reducer({}, setTemplatePreview(templatePreview));
    expect(result.templatePreviewImage).toBe(templatePreview);
  });

  it('should set the setTemplates', () => {
    const templates = [1, 2];
    const result = reducer({}, setTemplates(templates));
    expect(result.templates).toBe(templates);
  });

  it('should perform the correct actions for getTemplates', async () => {
    await getTemplates('asd')(dispatch);
    expect(dispatch).toBeCalledWith({
      type: TEMPLATES_LOADING,
    });

    expect(dispatch).toBeCalledWith({
      type: SET_TEMPLATES,
      payload: [1, 2],
    });
  });

  it('should perform the correct actions for getTemplatesSubstitutions', async () => {
    const templateId = 'asd';
    await getTemplatesSubstitutions(templateId)(dispatch);
    expect(dispatch).toBeCalledWith({
      type: TEMPLATES_SUBSTITUTIONS_LOADING,
    });
    expect(dispatch).toBeCalledWith({
      type: SET_SUBSTITUTION_FIELDS,
      payload: [1, 2, 3],
    });
    expect(dispatch).toBeCalledWith({
      type: SET_MANDATORY_ATTACHMENTS,
      payload: [],
    });
    expect(dispatch).toBeCalledWith({
      type: SET_PRINTER_OPTIONS,
      payload: {},
    });
  });

  it('should perform the correct actions for cancelCorrespondence', async () => {
    const correspondenceId = 'correspondenceId';
    const data = await cancelCorrespondence(correspondenceId)(dispatch);
    expect(data).toEqual({ data: { hello: 'world' } });
  });

  it('should perform the correct actions for generatePreviewCorrespondence', async () => {
    const correspondenceId = 'correspondenceId';
    const params = { a: 'b' };
    const getCorrespondenceDocumentAction = jest.fn(() => true);
    await generatePreviewCorrespondence(
      correspondenceId,
      params,
      getCorrespondenceDocumentAction
    )(dispatch);
    expect(dispatch).toBeCalledWith({
      type: SET_GENERATE_PREVIEW_LOADING,
      payload: true,
    });
    expect(dispatch).toBeCalledWith({
      type: SET_CORRESPONDENCE_DOCUMENTS,
      payload: [{ id: 'documentId', errorType: null, loading: true }],
    });
    expect(dispatch).toBeCalledWith(true);
  });

  it('should perform the correct actions for getCorrespondenceDocument', async () => {
    const correspondenceId = 'correspondenceId';
    const documentId = 'documentId';
    await getCorrespondenceDocumentActionCreator(correspondenceId, documentId)(dispatch);
    expect(dispatch).toBeCalledWith({
      type: ENRICH_CORRESPONDENCE_DOCUMENT,
      payload: {
        data: { dataFromServer: true, errorType: null, loading: false },
        id: 'documentId',
      },
    });
  });
});
