import _ from 'lodash';
import infoWindow from 'info_windows';

describe('infoWindow', () => {
  let maps;
  beforeAll(() => {
    maps = jest.fn();
  });

  describe('if InfoBubble is available', () => {
    test('should call infobubble', () => {
      let info = infoWindow(maps, 'info', { foo: 'bar' });
      expect(global.InfoBubble).toHaveBeenCalled();

      let options = global.InfoBubble.mock.calls[0][0];

      expect(options).toEqual(
        expect.objectContaining({
          maps,
          content: 'info',
          foo: 'bar',
        })
      );
    });
  });

  describe('If no infobubble', () => {
    beforeAll(() => {
      global.InfoBubble = undefined;
    });

    test('should create standard InfoWindow', () => {
      infoWindow(maps, 'info');
      expect(window.google.maps.InfoWindow).toHaveBeenCalled();

      let calls = window.google.maps.InfoWindow.mock.calls[0][0];

      expect(calls).toEqual({ content: 'info' });
    });
  });
});
