import { act } from 'react-dom/test-utils';

import useScreen, { variants } from '../../hooks/useScreen';

describe('useScreen', () => {
  it('renders only on size change', async () => {
    const tmpSize = global.innerWidth;

    const renderSpy = jest.fn();

    let wrapper;

    const changeSize = async (size) => {
      await act(async () => {
        global.innerWidth = size;
        global.dispatchEvent(new Event('resize'));
      });
      wrapper.update();
    };

    const Dummy = () => {
      const screenSize = useScreen();

      renderSpy(screenSize);

      return null;
    };

    global.innerWidth = 540;

    await act(async () => {
      wrapper = mount(<Dummy />);
    });
    wrapper.update();

    expect(renderSpy).toHaveBeenCalledWith(variants[0]);
    renderSpy.mockClear();

    await changeSize(541);
    expect(renderSpy).not.toHaveBeenCalled();

    await changeSize(768);
    expect(renderSpy).toHaveBeenCalledWith(variants[1]);
    renderSpy.mockClear();

    await changeSize(992);
    expect(renderSpy).toHaveBeenCalledWith(variants[2]);
    renderSpy.mockClear();

    await changeSize(993);
    expect(renderSpy).toHaveBeenCalledWith(variants[3]);
    renderSpy.mockClear();

    await changeSize(1200);
    expect(renderSpy).not.toHaveBeenCalled();

    await changeSize(1201);
    expect(renderSpy).toHaveBeenCalledWith(variants[4]);
    renderSpy.mockClear();

    await changeSize(1201);
    expect(renderSpy).not.toHaveBeenCalled();

    await changeSize(992);
    expect(renderSpy).toHaveBeenCalledWith(variants[2]);
    renderSpy.mockClear();

    global.innerWidth = tmpSize;

    await act(async () => {
      wrapper.unmount();
    });
    wrapper.update();
  });
});
