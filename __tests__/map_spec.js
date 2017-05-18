import _ from 'lodash';
import Gmap from '../src/map';

import checkCalls from '@djforth/morse-jasmine-wp/check_calls';
import {createHolder as createEl} from '@djforth/morse-jasmine-wp/create_elements';
import checkMulti from '@djforth/morse-jasmine-wp/check_multiple_calls';
import GetMod from '@djforth/morse-jasmine-wp/get_module';
const getMod = GetMod(Gmap);
import {removeElement as removeEl} from '@djforth/morse-jasmine-wp/create_elements';
import Stubs from '@djforth/morse-jasmine-wp/stub_inner';
const stubs = Stubs(Gmap);
import stub_chain from '@djforth/morse-jasmine-wp/stub_chain_methods';
import mockClass from '@djforth/morse-jasmine-wp/mock_class';
import SpyManager from '@djforth/morse-jasmine-wp/spy_manager';
const spyManager = SpyManager();

describe('map', function(){
  afterEach(function(){
    stub_chain.removeAll();
    spyManager.removeAll();
    stubs.revertAll();
  });
  describe('creator', function(){
    let creator;
    beforeEach(function(){
      spyManager.addSpy(['Map', 'LatLngBounds', 'event']);
      window.google = {maps: {}};
      window.google.maps = {
        event: spyManager.getSpy('event')
      ,  Map: spyManager.getSpy('Map')
      , LatLngBounds: spyManager.getSpy('LatLngBounds')
      };

      stub_chain.addConstructor('options', ['addType', 'addCenter', 'get']);
      stub_chain.addConstructor('map', ['centerMap', 'setZoom', 'getMap']);
      spyManager.addSpy('callback');
      creator = getMod('creator')(stub_chain.getConstructor('map'), stub_chain.getConstructor('options')());
      creator(spyManager.getSpy('callback'));
    });

    let calls = {
      'options.addType': ()=>stub_chain.getMethod('options', 'addType')
    , 'options.addCenter': ()=>stub_chain.getMethod('options', 'addCenter')
    , 'callback': ()=>spyManager.getSpy('callback')
    , 'map': [()=>stub_chain.getSpy('map')
      , ()=>[google.maps.Map, stub_chain.getConstructor('options')()]
    ]
    , 'map.centerMap': ()=>stub_chain.getMethod('map', 'centerMap')
    , 'map.setZoom': ()=>stub_chain.getMethod('map', 'setZoom')
    };
    checkMulti(calls);
  });

  describe('builder', function(){
    let map;
    beforeEach(function(){
      stubs.addSpy(['creator', 'createPath', 'LazyLoad', 'mapCreator', 'mapLoader', 'getOptions']);

      stub_chain.addConstructor('options', ['get', 'update'])
        .addConstructor('gpath', ['getPath'])
        .addConstructor('mapLoader', ['addPlugins', 'load']);

      spyManager.addSpy(['maps', 'mapLoaded']);

      stubs.getSpy('getOptions').and.returnValue(stub_chain.getConstructor('options')());
      stubs.getSpy('createPath').and.callFake(stub_chain.getConstructor('gpath'));
      stubs.getSpy('mapLoader').and.callFake(stub_chain.getConstructor('mapLoader'));
      stubs.getSpy('mapCreator').and.returnValue(spyManager.getSpy('maps'));
      stubs.getSpy('creator').and.returnValue(spyManager.getSpy('mapLoaded'));
    });

    describe('when no element', function(){
      beforeEach(function(){
        map = Gmap(null, 'gmaps-key');
      });

      it('should return undefined', function(){
        expect(map).toBeUndefined();
      });
    });

    describe('when element', function(){
      let el;
      beforeEach(function(){
        el = createEl('map');
        el.dataset.map = 'map-data';
        map = Gmap('map', 'gmaps-key');
      });

      afterEach(function(){
        removeEl(el);
      });

      let calls = {
        map: [()=>stubs.getSpy('createPath')
          , ['gmaps-key']
        ]
        , options: [()=>stubs.getSpy('getOptions')
          , ['map-data']
        ]
        , mapCreator: [()=>stubs.getSpy('mapCreator')
          , ()=>[el]
        ]
        , creator: [()=>stubs.getSpy('creator')
          , ()=>[spyManager.getSpy('maps'), stub_chain.getConstructor('options')()]
        ]
      };
      checkMulti(calls);

      describe('returns', function(){
        describe('addCallback', function(){
          beforeEach(function(){
            stubs.addSpy('partial');
            stubs.getSpy('partial').and.returnValue('cb');
          });

          it('should set callback', function(){
            map.addCallback('callback');
            let spy = stubs.getSpy('partial');
            expect(spy).toHaveBeenCalled();
            let cb = spy.calls.argsFor(0)[1];
            expect(cb).toEqual('callback');
            expect(window.mapLoaded).toEqual('cb');
          });
        });

        describe('addlazyload', function(){
          let lazyload, args;
          beforeEach(function(){
            lazyload = stubs.getSpy('LazyLoad');
            map.addlazyload('mouseover');
            args = lazyload.calls.argsFor(0);
          });

          afterEach(()=>{
            lazyload.calls.reset();
          });

          it('should call LazyLoad', function(){
            expect(lazyload).toHaveBeenCalled();
            expect(args[0]).toEqual(el);
            expect(args[1]).toEqual('mouseover');
            expect(args[2]).toEqual(jasmine.any(Function));
          });

          describe('callback', function(){
            let removeLoader;
            beforeEach(function(){
              let calls = args[2];
              removeLoader = jasmine.createSpy('remove');
              calls(removeLoader);
            });

            let calls = {
              'removeLoader': [()=>{
                console.log(removeLoader);
                return removeLoader;
              }]
              , 'gpath.getPath': [()=>stub_chain.getMethod('gpath', 'getPath')]
              , 'mapLoader.addPlugins': [()=>stub_chain.getMethod('mapLoader', 'addPlugins')]
              , 'options.get': [()=>stub_chain.getMethod('options', 'get')]
              , 'mapLoader.load': [()=>stub_chain.getMethod('mapLoader', 'load')]

            };
            checkMulti(calls);
          });
        });

        describe('load', function(){
          beforeEach(function(){
            map.load();
          });

          let calls = {
            'gpath.getPath': [()=>stub_chain.getMethod('gpath', 'getPath')]
              , 'mapLoader.addPlugins': [()=>stub_chain.getMethod('mapLoader', 'addPlugins')]
              , 'options.get': [()=>stub_chain.getMethod('options', 'get')]
              , 'mapLoader.load': [()=>stub_chain.getMethod('mapLoader', 'load')]
          };
          checkMulti(calls);
        });

        let calls = {
          addCenter: [()=>{
            map.addCenter(1, 2);
            return stub_chain.getMethod('options', 'update');
          }
            , [{lat: 1, lng: 2, centermap: true}]
          ]
          , addConfig: [()=>{
            map.addConfig({foo: 'bar'});
            return stub_chain.getMethod('options', 'update');
          }
            , [{foo: 'bar'}]
          ]
          , addLibraries: [()=>{
            map.addLibraries(['plugins']);
            return stub_chain.getMethod('options', 'update');
          }
            , [{libraries: ['plugins']}]
          ]
          , addType: [()=>{
            map.addType('ROADMAP');
            return stub_chain.getMethod('options', 'update');
          }
            , [{type: 'ROADMAP'}]
          ]
        };
        checkMulti(calls);
      });
    });
  });
});
