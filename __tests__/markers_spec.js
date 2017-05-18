import _ from 'lodash';
import markers from '../src/markers';

import mockGmaps from './helpers/stub_gmaps';
import Stubs from '@djforth/morse-jasmine-wp/stub_inner';
const stubs = Stubs(markers);
import checkCalls from '@djforth/morse-jasmine-wp/check_calls';

describe('markers', function(){
  let spy;
  beforeEach(function(){
    spy = jasmine.createSpyObj('marker', ['setIcon']);
    window.google = mockGmaps(
      {Marker: {type: 'withReturn', function: 'callFake', value: ()=>spy}
        , LatLng: {type: 'withReturn', function: 'callFake', value: ()=>'lnglat'}
      }
      );
  });

  afterEach(function(){
    stubs.revertAll();
  });

  describe('setIcon', function(){
    let setIcon;
    beforeEach(function(){
      setIcon = markers.__get__('setIcon');
    });

    it('should create icon if right data', function(){
      setIcon(spy, {picture: 'pin.png', width: 10, height: 10});
      expect(spy.setIcon).toHaveBeenCalled();
      let calls = spy.setIcon.calls.argsFor(0);
      expect(calls[0]).toEqual('pin.png');
      expect(_.isArray(calls[1])).toBeTruthy();
      expect(calls[1]).toEqual([10, 10]);
    });

    it('should not call setIcon if data not right', function(){
      setIcon(spy, {});
      expect(spy.setIcon).not.toHaveBeenCalled();
    });

    it('should not call setIcon if no marker', function(){
      setIcon(null, {picture: 'pin.png', width: 10, height: 10});
      expect(spy.setIcon).not.toHaveBeenCalled();
    });
  });

  describe('create marker', function(){
    let createMarker, maps, closer, spyIa, opts, data;
    let mk = {
      id: 1
      , lng: 2
      , lat: 3
      , infowindow: 'info'
    };

    beforeEach(function(){
      maps   = jasmine.createSpy('maps');
      closer = jasmine.createSpy('closer');
      stubs.addSpy(['createInfoWindow', 'addOpenClose', 'setIcon']);
      stubs.getSpy('createInfoWindow').and.returnValue('infoWindow');

      spyIa = jasmine.createSpy('ia');
      stubs.getSpy('addOpenClose').and.returnValue(spyIa);

      opts = {
        foo: 'bar'
      };

      createMarker = markers(maps, closer, opts);
      data = createMarker(mk);
    });

    afterEach(()=>{
      stubs.revertAll();
    });

    it('should return a function', function(){
      expect(_.isFunction(createMarker)).toBeTruthy();
    });

    it('should call new marker', function(){
      let m = google.maps.Marker;
      expect(m).toHaveBeenCalled();
      let calls = m.calls.argsFor(0)[0];
      expect(calls.map).toEqual(maps);
    });

    checkCalls(()=>{
      return google.maps.LatLng;
    }, 'new LatLng', [3, 2]);

    checkCalls(()=>{
      return  stubs.getSpy('setIcon');
    }, 'setIcon', ()=>[spy, mk]);

    checkCalls(()=>{
      return  stubs.getSpy('createInfoWindow');
    }, 'createInfoWindow', ()=>[maps, mk.infowindow, opts]);

    checkCalls(()=>{
      return  stubs.getSpy('addOpenClose');
    }, 'addOpenClose', ()=>[maps, mk.id, closer]);

    checkCalls(()=>{
      return  spyIa;
    }, 'infoActions', ()=>[spy, 'infoWindow']);

    it('should return marker and info window', function(){
      expect(data.marker).toEqual(spy);
      expect(data.info).toEqual('infoWindow');
    });
  });
});
