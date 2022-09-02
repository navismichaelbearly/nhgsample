import styled from 'styled-components';
import splitAndWrap, { shortenFileName } from './splitAndWrap';

describe('split a string ', () => {
  it('passing a space as splitter will wrap each element with a div', () => {
    const string = 'this is a string that include spaces';
    const Wrapper = styled.div({});
    expect(splitAndWrap(string, ' ', Wrapper)).toMatchSnapshot();
  });

  it('passing a null splitter will return the same string wrapped in the passed node', () => {
    const string = 'this is a string that include spaces';
    const Wrapper = styled.div({});
    expect(splitAndWrap(string, null, Wrapper)).toMatchSnapshot();
  });
});

describe('shortenFileName', () => {
  it('should shorten a file name that has length more than 15 characters', () => {
    const shorten = shortenFileName(7);
    expect(shorten('hello.jpg')).toEqual('hello.jpg');
    expect(shorten('hellowonderfulwonderfulworld.jpg')).toEqual('hellowo...rld.jpg');
  });
});
