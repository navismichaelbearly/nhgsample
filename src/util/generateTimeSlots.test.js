import generateTimeSlots from './generateTimeSlots';

describe('generateTimeSlots', () => {
  it('return an array of time slots between the two given time inputs, 5 minutes apart', () => {
    expect(generateTimeSlots('09:00', '10:00')).toMatchSnapshot();
  });

  it('return an empty array if none of the params are passed in', () => {
    expect(generateTimeSlots()).toEqual([]);
  });
});
