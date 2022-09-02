// use to format boolean values from data to string Yes/No
// eslint-disable-next-line import/prefer-default-export
export const formatBoolean = val => {
  if (val !== undefined || null) {
    let str = val.toString();
    if (str === 'true') {
      str = 'Yes';
    } else if (str === 'false') {
      str = 'No';
    }
    return str;
  }
  return null;
};
