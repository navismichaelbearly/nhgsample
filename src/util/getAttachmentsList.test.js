import getAttachmentsFromId from './getAttachmentsList';
import { documentsApi } from '../api';

jest.mock('../api', () => ({
  documentsApi: {
    getActivityDocuments: jest.fn(),
    getCaseDocuments: jest.fn(),
  },
}));

describe('activites reducer', () => {
  it('should call the right api for an Activity', async () => {
    await getAttachmentsFromId('Interaction', 'abc123');
    expect(documentsApi.getActivityDocuments).toBeCalledWith('abc123');
  });

  it('should call the right api for a Legal Referral', async () => {
    await getAttachmentsFromId('LegalReferral', 'abc123');
    expect(documentsApi.getCaseDocuments).toBeCalledWith('abc123');
  });

  it('should NOT call the any api for other history items', async () => {
    const res = await getAttachmentsFromId('Batman', 'abc123');
    expect(res).toEqual({ data: [] });
  });
});
