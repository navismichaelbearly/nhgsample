import format from 'date-fns/format';
import constructDateFromTimeAndDate from './constructDateFromTimeAndDate';

describe('constructDateFromTimeAndDate', () => {
  it('return the constructed date and time', () => {
    const date = format(new Date('2018-02-22T00:00:00.000Z'));
    const time = '13:20';
    expect(constructDateFromTimeAndDate(date, time)).toMatchSnapshot();
  });
});
