import reducer, {
  showModal,
  hideModal,
  setContent,
  setModalContent,
  SET_CONTENT,
  SHOW_MODAL,
  HIDE_MODAL,
} from './';

describe('modal', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  it('should set shown modal state', () => {
    const result = reducer({}, showModal());
    expect(result).toEqual({ visible: true });
  });

  it('should set hidden modal state', () => {
    const result = reducer({}, hideModal());
    expect(result).toEqual({ visible: false });
  });

  it('should set modal content state', () => {
    const content = 'Test Content';
    const result = reducer({}, setContent(content));
    expect(result).toEqual({ content });
  });

  describe('Given content', () => {
    const content = 'Modal content';

    beforeEach(async () => {
      await setModalContent(content)(dispatch);
    });

    it('should set the modal content', () => {
      expect(dispatch).toBeCalledWith({
        payload: { content, extendStyle: null },
        type: SET_CONTENT,
      });
    });

    it('should show the content', () => {
      expect(dispatch).toBeCalledWith({
        payload: { visible: true },
        type: SHOW_MODAL,
      });
    });
  });

  describe('Given content with extendStyle', () => {
    const content = 'Modal content';
    const extendStyle = 'max-width: 50%';

    beforeEach(async () => {
      await setModalContent(content, extendStyle)(dispatch);
    });

    it('should set the modal content and extend style', () => {
      expect(dispatch).toBeCalledWith({
        payload: { content, extendStyle },
        type: SET_CONTENT,
      });
    });
  });

  describe('Given no content', () => {
    const content = '';

    beforeEach(async () => {
      await setModalContent(content)(dispatch);
    });

    it('should set the modal content', () => {
      expect(dispatch).toBeCalledWith({
        payload: { content, extendStyle: null },
        type: SET_CONTENT,
      });
    });

    it('should hide the content', () => {
      expect(dispatch).toBeCalledWith({
        payload: { visible: false },
        type: HIDE_MODAL,
      });
    });
  });
});
