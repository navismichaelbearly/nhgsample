import reducer, { addNotification, initialState, removeNotification } from './';

const notificationPayload = {
  title: 'notification title',
  description: 'notification description',
  notificationType: 'confirmation',
};

describe('notifications reducer', () => {
  it('should set a default state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  describe('Add notification', () => {
    it('should add notification to list of items when there is no matching notification type', () => {
      const result = reducer(undefined, addNotification(notificationPayload));
      expect(result.items.length).toEqual(1);
      expect(result.items[0]).toMatchObject(notificationPayload);
    });

    it('should replace the matching notification', () => {
      const secondNotificationPayload = {
        title: 'second notification title',
        description: 'second notification description',
        notificationType: 'confirmation',
      };
      const result = reducer(
        { ...initialState, items: [notificationPayload] },
        addNotification(secondNotificationPayload)
      );
      expect(result.items.length).toEqual(1);
      expect(result.items[0]).toMatchObject(secondNotificationPayload);
    });
  });

  describe('Remove notification', () => {
    const state = {
      ...initialState,
      items: [notificationPayload, { ...notificationPayload, notificationType: 'some-other-type' }],
    };
    it('should only remove the matching notification if notificationType is provided', () => {
      const result = reducer(state, removeNotification('some-other-type'));
      expect(result.items.length).toEqual(1);
      expect(result.items[0]).toEqual(notificationPayload);
    });
    it('should remove all notifications if notificationType is not provided', () => {
      const result = reducer(state, removeNotification());
      expect(result.items.length).toEqual(0);
    });
  });
});
