export default (devString, prodString) =>
  process.env.NODE_ENV === 'development' ? devString : prodString;
