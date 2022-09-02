import React from 'react';
import replace from 'ramda/src/replace';

// this function will accept an integer N, maximum characters
// and will shorten a file name by stripping out first N and last 3 characters
// i.e. shortenFileName(3)('some-big-title.jpg') => som...tle.jpg
export const shortenFileName = maxChars => {
  const regex = new RegExp(`(.{${maxChars}}).+(.{3})\\.`);
  return replace(regex, '$1...$2.');
};

const splitAndWrap = (stringToSplit, splitter, WrapperComponent) => {
  const a = stringToSplit.split(splitter);
  return a.map(item => <WrapperComponent key={item.toString()}>{item}</WrapperComponent>);
};

export default splitAndWrap;
