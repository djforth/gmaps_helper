const _        = require('lodash');

const CreateMap = require('../src/create_map');

const checkCalls = require('@djforth/morse-jasmine-wp/check_calls')
  , createEl = require('@djforth/morse-jasmine-wp/create_elements').createHolder
  , getMod   = require('@djforth/morse-jasmine-wp/get_module')(CreateMap)
  , gmapsSub   = require('./helpers/stub_gmaps_new')()
  , removeEl = require('@djforth/morse-jasmine-wp/create_elements').removeElement
  , stubs = require('@djforth/morse-jasmine-wp/stub_inner')(CreateMap)
  , mockClass = require('@djforth/morse-jasmine-wp/mock_class')
  , spyManager = require('@djforth/morse-jasmine-wp/spy_manager')();

describe('mapCreator', function(){
  let map;
  beforeEach(function(){
    spyManager.addSpy([{title: 'closer', opts: ['addMarkers']}, 'LatLngBounds']);
    stubs.addSpy(['closeInfo', 'markerCreator']);
    stubs.getSpy('closeInfo').and.returnValue(spyManager.getSpy('closer'));
    stubs.getSpy('markerCreator').and.returnValue('markerCreator');
  });

  afterEach(function(){
    stubs.revertAll();
    spyManager.removeAll();
    gmapsSub.removeAll();
  });

  describe('makeMarker', function(){
    let createMarker, makeMarker, mark;
    beforeEach(function(){
      spyManager.addSpy(['createMarker']);
      spyManager.addReturn('createMarker')('returnValue', 'Marker');
      makeMarker   = getMod('makeMarker');
      createMarker = makeMarker(spyManager.getSpy('createMarker'), spyManager.getSpy('closer'));
      mark = createMarker('mark');
    });

    afterEach(()=>{
      spyManager.removeSpy('createMarker').removeSpy('closer');
    });

    it('should return the value of createMarker', function(){
      expect(mark).toEqual('Marker');
    });

    checkCalls(()=>{
      return spyManager.getSpy('createMarker');
    }, 'createMarker', ()=>['mark']);

    checkCalls(()=>{
      return spyManager.getSpy('closer').addMarkers;
    }, 'closer', ()=>['Marker']);
  });

  describe('creator', function(){
    let creator;
    beforeEach(function(){
      creator = getMod('creator');
      spyManager.addSpy(['create']);
      spyManager.getSpy('create').and.returnValue('marker');
    });

    it('creates marker if array is passed', function(){
      let spy = spyManager.getSpy('create');
      let m = creator(['pin0', 'pin1'], spy);
      expect(spy).toHaveBeenCalledTimes(2);
      expect(m.length).toEqual(2);
    });

    it('creates marker if data is passed', function(){
      let spy = spyManager.getSpy('create');
      let m = creator('pin', spy);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(m.length).toEqual(1);
    });
  });

  describe('centerMap', function(){
    let centerMap, latlng, markers;
    beforeEach(function(){
      centerMap = _.bind(getMod('centerMap'), {obj: {}});

      spyManager.addSpy([{title: 'map', opts: ['fitBounds']}, {title: 'marker', opts: ['getPosition']}]);
      latlng = mockClass('LatLngBounds', ['extend']);
      let m = spyManager.getSpy('marker');
      m.getPosition.and.returnValue('bounds');
      centerMap(spyManager.getSpy('map'), [{marker: m}], latlng.getMock());
    });

    it('should call LatLngBounds', function(){
      expect(latlng.getSpy('init')).toHaveBeenCalled();
    });

    it('should call LatLngBounds.extends', function(){
      expect(latlng.getSpy('extend')).toHaveBeenCalledWith('bounds');
    });

    it('should call marker.getPositon', function(){
      expect(spyManager.getSpy('marker').getPosition).toHaveBeenCalled();
    });

    it('should call map.fitBounds', function(){
      expect(spyManager.getSpy('map').fitBounds).toHaveBeenCalled();
    });
  });

  describe('setZoom', function(){
    let setZoom;
    beforeEach(function(){
      setZoom = _.bind(getMod('setZoom'), {obj: {}});
      spyManager.addSpy({title: 'event', opts: ['addListener', 'removeListener']});
      setZoom('map', 10, spyManager.getSpy('event'));
    });

    checkCalls(()=>{
      return spyManager.getSpy('event').addListener;
    }, 'google.maps.addListener', ()=>['map', 'idle']
    );

    describe('sets zoom level', function(){
      let callback;
      beforeEach(()=>{
        let spy = spyManager.getSpy('event').addListener;

        callback = spy.calls.argsFor(0)[2];

        spyManager.addSpy(['getZoom', 'setZoom']);
        spyManager.getSpy('getZoom').and.returnValue(20);
        callback = _.bind(callback, {
          getZoom: spyManager.getSpy('getZoom')
        , setZoom: spyManager.getSpy('setZoom')
        });

        callback();
      });

      it('should call getZoom', function(){
        expect(spyManager.getSpy('getZoom')).toHaveBeenCalled();
      });

      it('should call setZoom', function(){
        expect(spyManager.getSpy('setZoom')).toHaveBeenCalledWith(10);
      });

      it('should call setZoom', function(){
        expect(spyManager.getSpy('event').removeListener).toHaveBeenCalled();
      });
    });
  });

  describe('create map with', function(){
    let create_map;
    beforeEach(function(){
      stubs.addSpy(['makeMarker', 'creator']);
      spyManager.addSpy([{title: 'options', opts: ['get', 'getAll']}, 'Map']);
      spyManager.addReturn('Map')('returnValue', 'map');
      stubs.getSpy('makeMarker').and.returnValue('MC');
      let options = spyManager.getSpy('options');
      options.getAll.and.returnValue('all_options');
      options.get.and.returnValue(['pin0', 'pin1']);
      create_map = CreateMap('el');
    });

    describe('createMap', function(){
      beforeEach(function(){
        create_map(spyManager.getSpy('Map'), spyManager.getSpy('options'));
      });

      checkCalls(()=>{
        return spyManager.getSpy('Map');
      }, 'google.maps.Map', ()=>['el', 'all_options']);

      checkCalls(()=>{
        return spyManager.getSpy('options').getAll;
      }, 'options.getAll');

      checkCalls(()=>{
        return stubs.getSpy('closeInfo');
      }, 'closeInfo');

      checkCalls(()=>{
        return stubs.getSpy('makeMarker');
      }, 'makeMarker', ()=>['markerCreator', spyManager.getSpy('closer')]);

      checkCalls(()=>{
        return stubs.getSpy('markerCreator');
      }, 'markerCreator');

      checkCalls(()=>{
        return stubs.getSpy('creator');
      }, 'creator', ()=>[['pin0', 'pin1'], 'MC']);
    });
  });
});
