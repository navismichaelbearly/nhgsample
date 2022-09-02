import moment from 'moment';

export default (start, end) => {
  if (!start || !end) {
    return [];
  }
  const startTime = moment(start, 'HH:mm');
  const endTime = moment(end, 'HH:mm');

  // This check is to avoid endTime after midnight being treated as before startTime
  if (endTime.isBefore(startTime)) {
    endTime.add(1, 'day');
  }

  const timeSlots = [];

  while (startTime <= endTime) {
    // eslint-disable-next-line new-cap
    timeSlots.push(new moment(startTime).format('HH:mm'));
    startTime.add(5, 'minutes');
  }
  return timeSlots;
};
