import _, { bind } from 'lodash';

import CreateMap from 'create_map';
import closeInfo from 'close_info';
import markerCreator from 'markers';

jest.mock('close_info', () =>
  jest.fn(() => ({
    addMarkers: jest.fn(),
  }))
);
jest.mock('markers', () => jest.fn(() => jest.fn()));

describe('mapCreator', () => {
  let create, creator, fitBounds, map, Map, elm, options, setCenter;

  const opts = {
    lat: 1,
    lng: 2,
    pins: ['marker'],
    zoom: 15,
  };

  beforeAll(() => {
    document.body.innerHTML = "<div id='gmap'></div>";

    options = {
      get: jest.fn(key => opts[key]),
      getAll: jest.fn(() => opts),
    };
  });

  test('if no element passed', () => {
    creator = CreateMap();
    expect(creator).toBeNull();
  });

  describe('if no element passed', () => {
    beforeAll(() => {
      fitBounds = jest.fn();
      setCenter = jest.fn();
      map = { fitBounds, setCenter };
      Map = jest.fn().mockImplementation(() => map);
      elm = document.getElementById('gmap');
      creator = CreateMap(elm);
      create = creator(Map, options);
    });

    test('should return a function', () => {
      expect(creator).toBeFunction();
    });

    test('should return object', () => {
      expect(create).toEqual(
        expect.objectContaining({
          getMap: expect.any(Function),
          setPosition: expect.any(Function),
          centerMap: expect.any(Function),
          setZoom: expect.any(Function),
        })
      );
    });

    test('should call map', () => {
      expect(Map).toHaveBeenLastCalledWith(elm, opts);
    });

    test('closeInfo should have been called', () => {
      expect(closeInfo).toHaveBeenCalledWith(map);
    });

    test('should call markerCreator', () => {
      expect(markerCreator).toHaveBeenCalledWith(
        map,
        expect.objectContaining({
          addMarkers: expect.any(Function),
        })
      );
    });

    test('should return map object', () => {
      expect(create.getMap()).toEqual(map);
    });

    test('should setPosition', () => {
      const LatLng = jest.fn().mockImplementation(() => 'pos');
      create.setPosition(LatLng);
      expect(LatLng).toHaveBeenCalledWith({
        lat: 1,
        lng: 2,
      });

      expect(setCenter).toHaveBeenCalledWith('pos');
    });

    describe('setZoom', () => {
      let event, callback, callbackBound, getZoom, setZoom, zoom;
      beforeAll(() => {
        event = {
          addListener: jest.fn(() => 'listener'),
          removeListener: jest.fn(),
        };
        zoom = 10;
        getZoom = jest.fn(() => zoom);
        setZoom = jest.fn();
        create.setZoom(event);
        callback = event.addListener.mock.calls[0][2];

        callbackBound = bind(callback, { getZoom, setZoom }, _);
        // console.log('callbackBound', callbackBound);
      });

      test('should setZoom', () => {
        expect(event.addListener).toHaveBeenCalledWith(map, 'idle', expect.any(Function));
      });

      xtest("if zoom doesn't match", () => {
        callbackBound();
        expect(getZoom).toHaveBeenCalled();
      });
    });
  });
});
