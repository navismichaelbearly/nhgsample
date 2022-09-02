import { reducers } from './';

jest.mock('./activities', () => () => ({
  item: 'activities-reducer',
}));

jest.mock('./arrears', () => () => ({
  item: 'arrears-reducer',
}));

jest.mock('./sendCorrespondence', () => () => ({
  item: 'sendCorrespondence-reducer',
}));

jest.mock('./customer', () => () => ({
  item: 'customer-reducer',
}));

jest.mock('./dictionary', () => () => ({
  item: 'dictionary-reducer',
}));

jest.mock('./features', () => () => ({
  item: 'features-reducer',
}));

jest.mock('./forms', () => () => ({
  item: 'forms-reducer',
}));

jest.mock('./housingofficersearch', () => () => ({
  item: 'housingofficersearch-reducer',
}));

jest.mock('./interactions', () => () => ({
  item: 'interactions-reducer',
}));

jest.mock('./legalReferral', () => () => ({
  item: 'legalReferral-reducer',
}));

jest.mock('./linkedCases', () => () => ({
  item: 'linkedCases-reducer',
}));

jest.mock('./media', () => () => ({
  item: 'media-reducer',
}));

jest.mock('./modal', () => () => ({
  item: 'modal-reducer',
}));

jest.mock('./navigation', () => () => ({
  item: 'navigation-reducer',
}));

jest.mock('./notes', () => () => ({
  item: 'notes-reducer',
}));

jest.mock('./tasks', () => () => ({
  item: 'tasks-reducer',
}));

jest.mock('./notifications', () => () => ({
  item: 'notifications-reducer',
}));

jest.mock('./patch', () => () => ({
  item: 'patch-reducer',
}));

jest.mock('./paymentPlan', () => () => ({
  item: 'paymentPlan-reducer',
}));

jest.mock('./pause', () => () => ({
  item: 'pause-reducer',
}));

jest.mock('./referral', () => () => ({
  item: 'referral-reducer',
}));

jest.mock('./tenancy', () => () => ({
  item: 'tenancy-reducer',
}));

jest.mock('./ribbon', () => () => ({
  item: 'ribbon-reducer',
}));

jest.mock('./user', () => () => ({
  item: 'user-reducer',
}));

jest.mock('./welfareReform', () => () => ({
  item: 'welfareReform-reducer',
}));

describe('combined reducers', () => {
  it('generates the correct state', () => {
    const result = reducers();
    expect(result).toEqual({
      activities: {
        item: 'activities-reducer',
      },
      arrears: {
        item: 'arrears-reducer',
      },
      customer: {
        item: 'customer-reducer',
      },
      dictionary: {
        item: 'dictionary-reducer',
      },
      features: {
        item: 'features-reducer',
      },
      forms: {
        item: 'forms-reducer',
      },
      housingofficersearch: {
        item: 'housingofficersearch-reducer',
      },
      interactions: {
        item: 'interactions-reducer',
      },
      legalReferral: {
        item: 'legalReferral-reducer',
      },
      linkedCases: {
        item: 'linkedCases-reducer',
      },
      media: {
        item: 'media-reducer',
      },
      modal: {
        item: 'modal-reducer',
      },
      navigation: {
        item: 'navigation-reducer',
      },
      notes: {
        item: 'notes-reducer',
      },
      sendCorrespondence: {
        item: 'sendCorrespondence-reducer',
      },
      tasks: {
        item: 'tasks-reducer',
      },
      notifications: {
        item: 'notifications-reducer',
      },
      patch: {
        item: 'patch-reducer',
      },
      pause: {
        item: 'pause-reducer',
      },
      paymentPlan: {
        item: 'paymentPlan-reducer',
      },
      referral: {
        item: 'referral-reducer',
      },
      tenancy: {
        item: 'tenancy-reducer',
      },
      ribbon: {
        item: 'ribbon-reducer',
      },
      user: {
        item: 'user-reducer',
      },
      welfareReform: {
        item: 'welfareReform-reducer',
      },
    });
  });
});
