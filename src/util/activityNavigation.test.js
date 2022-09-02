import activityNavigation from './activityNavigation';

const activities = [{ id: 'first' }, { id: 'second' }];

describe('activityNavigation', () => {
  it('should return 4 methods', () => {
    expect(activityNavigation(activities, 'first')).toMatchSnapshot();
  });

  describe('isFirst', () => {
    it('should return true if the item is the first activity', () => {
      expect(activityNavigation(activities, 'first').isFirst()).toBe(true);
    });
    it('should return false if the item is not the first activity', () => {
      expect(activityNavigation(activities, 'second').isFirst()).toBe(false);
    });
  });

  describe('isLast', () => {
    it('should return true if the item is the last activity', () => {
      expect(activityNavigation(activities, 'second').isLast()).toBe(true);
    });
    it('should return false if the item is not the last activity', () => {
      expect(activityNavigation(activities, 'first').isLast()).toBe(false);
    });
  });

  describe('getNextHistoryId', () => {
    it('should return the next id if currentId is not the last item', () => {
      expect(activityNavigation(activities, 'first').getNextHistoryId()).toEqual('second');
    });
    it('should return null if currentId is the last item', () => {
      expect(activityNavigation(activities, 'second').getNextHistoryId()).toBe(null);
    });
  });

  describe('getPreviousHistoryId', () => {
    it('should return the previous id if currentId is not the first item', () => {
      expect(activityNavigation(activities, 'second').getPreviousHistoryId()).toEqual('first');
    });
    it('should return null if currentId is the first item', () => {
      expect(activityNavigation(activities, 'first').getPreviousHistoryId()).toBe(null);
    });
  });
});
