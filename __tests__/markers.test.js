import _ from 'lodash';
import markers from 'markers';
import createInfoWindow from 'info_windows';
import addOpenClose from 'open_close';

let infoWindow = jest.fn();
jest.mock('info_windows', () => jest.fn(() => 'Info Window'));
jest.mock('open_close', () => jest.fn(() => jest.fn()));

describe('markers', () => {
  let createMarker, map, closer, opts, data;

  describe('If marker ', () => {
    let mk = {
      id: 1,
      height: 10,
      lng: 2,
      lat: 3,
      picture: '/my-icon.png',
      width: 10,
    };

    beforeAll(() => {
      map = jest.fn();
      closer = jest.fn();
      opts = {
        foo: 'bar',
      };

      createMarker = markers(map, closer, opts);
      data = createMarker(mk);
    });

    test('should return a function', () => {
      expect(createMarker).toBeFunction();
    });

    test('should call new google.maps.Marker', () => {
      let m = google.maps.Marker;
      expect(m).toHaveBeenCalledWith(
        expect.objectContaining({
          position: expect.any(Function),
          map,
        })
      );
    });

    test('should call new google.maps.LatLng', () => {
      let m = google.maps.LatLng;
      expect(m).toHaveBeenCalledWith(3, 2);
    });

    test('should call new google.maps.LatLng.prototype.setIcon', () => {
      // let m = setIcon;
      expect(setIcon).toHaveBeenCalledWith('/my-icon.png', [10, 10]);
    });

    test('should not call createInfoWindow & addOpenClose', () => {
      expect(createInfoWindow).not.toHaveBeenCalled();
      expect(addOpenClose).not.toHaveBeenCalled();
    });

    test('should return the correct data', () => {
      expect(data.marker).toEqual({ setIcon });
      expect(data.info).toBeUndefined();
    });
  });

  describe('If marker fails', () => {
    let mk = {
      id: 1,
      infowindow: 'Info',
      height: 10,
      lng: 2,
      lat: 3,
      picture: '/my-icon.png',
      width: 10,
    };

    beforeAll(() => {
      global.setIcon = null;
      map = jest.fn();
      closer = jest.fn();
      opts = {
        foo: 'bar',
      };

      createMarker = markers(map, closer, opts);
      data = createMarker(mk);
    });

    afterAll(() => {
      global.setIcon = jest.fn();
    });

    test('should call createInfoWindow', () => {
      expect(createInfoWindow).toHaveBeenCalledWith(map, 'Info', opts);
    });

    test('should call addOpenClose', () => {
      expect(addOpenClose).toHaveBeenCalledWith(map, 1, closer);
    });

    test('should return the correct data', () => {
      expect(data.marker).toEqual(expect.any(Object));
      expect(data.info).toEqual('Info Window');
    });
  });

  describe('If marker but no picture, width or height', () => {
    let mk = {
      id: 1,
      infowindow: 'Info',
      lng: 2,
      lat: 3,
    };

    beforeAll(() => {
      map = jest.fn();
      closer = jest.fn();
      opts = {
        foo: 'bar',
      };

      createMarker = markers(map, closer, opts);
      data = createMarker(mk);
    });

    test('should call createInfoWindow', () => {
      expect(createInfoWindow).toHaveBeenCalledWith(map, 'Info', opts);
    });

    test('should call addOpenClose', () => {
      expect(addOpenClose).toHaveBeenCalledWith(map, 1, closer);
    });

    test('should return the correct data', () => {
      expect(data.marker).toEqual(expect.any(Object));
      expect(data.info).toEqual('Info Window');
    });
  });
});
