import devElse from './devElse';

const getAvatarSrc = id => {
  const baseUrl = devElse(
    'https://nhhuksmedsamediad.blob.core.windows.net/employees/$id/Image/profile.jpg/profile_original.jpg',
    '#{NHH.Core.AvatarURL}'
  );

  return baseUrl.replace('$id', id);
};

export default ({ fullname, id, patchName }) => ({
  fullname,
  name: fullname,
  patchName,
  id,
  src: getAvatarSrc(id),
});
