const _         = require('lodash');
const infoWindow = require('../src/info_windows');

var mockGmaps = require('./helpers/stub_gmaps');

describe('infoWindow', function(){
  afterEach(function(){
    window.InfoBubble = window.google = undefined;
  });

  describe('createInfoBubble', function(){
    var createInfoBubble, InfoBubble, map;
    beforeEach(function(){
      createInfoBubble = infoWindow.__get__('createInfoBubble');
      map = jasmine.createSpy('map');
    });

    it('should create new infobubble', function(){
      window.InfoBubble = jasmine.createSpy('InfoBubble').and.returnValue('infoWindow');
      let info = createInfoBubble(map, 'info');

      expect(window.InfoBubble).toHaveBeenCalled();

      let calls =  window.InfoBubble.calls.argsFor(0)[0];

      expect(calls.maps).toEqual(map);
      expect(calls.content).toEqual('info');
    });
  });

  describe('createInfoWindow', function(){
    var revert, createInfoWindow, InfoBubble, map, ibSpy;
    beforeEach(function(){
      // createInfoWindow = Gmap.__get__("createInfoWindow");
      map    = jasmine.createSpy('map');
      ibSpy  = jasmine.createSpy('ib');
      revert = infoWindow.__set__('createInfoBubble', ibSpy);
    });

    afterEach(function(){
      revert();
    });

    it('should call infobubble', function(){
      window.InfoBubble = jasmine.createSpy('InfoBubble').and.returnValue('infoWindow');
      let info = infoWindow(map, 'info');
      expect(ibSpy).toHaveBeenCalled();

      let calls =  ibSpy.calls.argsFor(0);

      expect(calls[0]).toEqual(map);
      expect(calls[1]).toEqual('info');
    });

    it('should create standard InfoWindow', function(){
      window.google = mockGmaps(
        {InfoWindow: {
          type: 'withReturn'
        , function: 'returnValue'
        , value: 'info'
        }
        });

      infoWindow(map, 'info');
      expect(window.google.maps.InfoWindow).toHaveBeenCalled();

      let calls =  window.google.maps.InfoWindow.calls.argsFor(0)[0];

      expect(calls.content).toEqual('info');
    });
  });
});
