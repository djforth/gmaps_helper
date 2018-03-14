import _ from 'lodash';
import closeInfo from 'close_info';
// import dummyMarker from './helpers/stub_marker';
const dummyMarker = i => ({
  marker: jest.fn().mockName(`marker${i}`),
  info: {
    close: jest.fn().mockName(`marker_close${i}`),
  },
});

describe('closeInfo', () => {
  let closer, map;

  beforeEach(() => {
    map = jest.fn().mockName('map');
    closer = closeInfo(map);
  });

  describe('addMarker', () => {
    test('should add if object is passed', () => {
      closer.addMarkers(dummyMarker(0));
      expect(closer.getAll().length).toEqual(1);
    });

    test('should add if array is passed', () => {
      let m = [dummyMarker(0), dummyMarker(1)];
      closer.addMarkers(m);
      expect(closer.getAll().length).toEqual(2);
    });
  });

  describe('closeAllWindows', () => {
    test('call close with valid markers', () => {
      let marker = dummyMarker(0);
      closer.addMarkers(marker);
      closer.closeAllWindows();

      expect(marker.info.close).toHaveBeenCalled();
      let calls = marker.info.close.mock.calls[0];
      expect(calls[0]).toEqual(map);
      expect(calls[1]).toEqual(marker.marker);
    });

    test('should not call close if no marker', () => {
      let marker = dummyMarker(0);
      marker = _.omit(marker, 'marker');
      closer.addMarkers(marker);
      closer.closeAllWindows();

      expect(marker.info.close).not.toHaveBeenCalled();
    });
  });
});
