const _         = require('lodash');
const closeInfo = require('../src/close_info');

var dummyMarker = require('./helpers/stub_marker');

describe('closeInfo', function(){
  let closer, map;

  beforeEach(function(){
    map = jasmine.createSpy('map');
    closer = closeInfo(map);
  });

  describe('addMarker', function(){
    it('should add if object is passed', function(){
      closer.addMarkers(dummyMarker(0));
      expect(closer.getAll().length).toEqual(1);
    });

    it('should add if array is passed', function(){
      let m = [dummyMarker(0), dummyMarker(1)];
      closer.addMarkers(m);
      expect(closer.getAll().length).toEqual(2);
    });
  });

  describe('closeAllWindows', function(){
    it('call close with valid markers', function(){
      let marker = dummyMarker(0);
      closer.addMarkers(marker);
      closer.closeAllWindows();

      expect(marker.info.close).toHaveBeenCalled();
      let calls = marker.info.close.calls.argsFor(0);
      expect(calls[0]).toEqual(map);
      expect(calls[1]).toEqual(marker.marker);
    });

    it('should not call close if no marker', function(){
      let marker = dummyMarker(0);
      marker = _.omit(marker, 'marker');
      closer.addMarkers(marker);
      closer.closeAllWindows();

      expect(marker.info.close).not.toHaveBeenCalled();
    });
  });
});
