import findIndex from 'ramda/src/findIndex';
import propEq from 'ramda/src/propEq';

export default (activities = [], currentId) => {
  const currentActivityIndex = findIndex(propEq('id', currentId))(activities);
  const isLast = () => (activities.length ? currentActivityIndex + 1 === activities.length : false);
  const isFirst = () => (activities.length ? currentActivityIndex === 0 : false);

  const getNextHistoryId = () => {
    const isLastItem = isLast();
    const nextHistoryActivity =
      currentActivityIndex >= 0 && !isLastItem ? activities[currentActivityIndex + 1] : null;
    return nextHistoryActivity ? nextHistoryActivity.id : null;
  };

  const getPreviousHistoryId = () => {
    const isFirstItem = isFirst();

    const previousHistoryActivity =
      currentActivityIndex >= 0 && !isFirstItem ? activities[currentActivityIndex - 1] : null;
    return previousHistoryActivity ? previousHistoryActivity.id : null;
  };

  return {
    getNextHistoryId,
    getPreviousHistoryId,
    isFirst,
    isLast,
  };
};
