import addHours from 'date-fns/add_hours';
import addMinutes from 'date-fns/add_minutes';
import format from 'date-fns/format';
import parse from 'date-fns/parse';

export const parseTime = time => {
  const splitOnColon = time.split(':');
  return {
    hours: splitOnColon[0] || '',
    minutes: splitOnColon[1] || '',
  };
};

export default (date, time) => {
  // date needs to be parsable by date-fns (e.g. YYYY-MM-DDTHH:mm:ss.SSSZ)
  // time should be in HH:mm format
  let constructedDate;
  const parsedDate = parse(date);
  const parsedTime = parseTime(time);

  constructedDate = addHours(parsedDate, parsedTime.hours);
  constructedDate = addMinutes(constructedDate, parsedTime.minutes);
  return format(constructedDate);
};
