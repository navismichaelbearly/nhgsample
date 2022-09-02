import reducer, { updateRibbon, initialState } from './';

describe('ribbon reducer', () => {
  it('should set a default state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should update any ribbon property', () => {
    const newBreadcrumb = [{ label: 'Hello world' }];
    const newTitle = 'Ribbon';

    let result = reducer(initialState, updateRibbon('title', newTitle));
    expect(result).toHaveProperty('title', newTitle);

    result = reducer(initialState, updateRibbon('breadcrumb', newBreadcrumb));
    expect(result).toHaveProperty('breadcrumb', newBreadcrumb);
  });

  it('also accepts an object of key value pairs to be updated', () => {
    const newBreadcrumb = [{ label: 'Hello world' }];
    const newTitle = 'Ribbon';

    const result = reducer(
      initialState,
      updateRibbon({
        title: newTitle,
        breadcrumb: newBreadcrumb,
      })
    );

    expect(result).toHaveProperty('title', newTitle);
    expect(result).toHaveProperty('breadcrumb', newBreadcrumb);
  });
});
