import _ from 'lodash';
import Options from 'options';

// import mockGmaps from './helpers/stub_gmaps';

describe('options', () => {
  let dataset, opts;
  beforeAll(() => {
    dataset = JSON.stringify({ pins: ['pins'], plugins: '/some/plugin' });
    opts = Options(dataset);
  });

  test('should add dataset', () => {
    expect(opts.get('pins')).toEqual(['pins']);
    expect(opts.get('plugins')).toEqual('/some/plugin');
  });

  test('should allow you to get options', () => {
    expect(opts.get('zoom')).toEqual(15);
    expect(opts.getAll()).toBeObject();
  });

  describe('addType', () => {
    test('should ROADMAP by default', () => {
      opts.addType();
      expect(opts.get('mapTypeId')).toEqual(google.maps.MapTypeId.ROADMAP);
    });

    test('should all one to be specified', () => {
      opts.addType('SATELLITE');
      expect(opts.get('mapTypeId')).toEqual(google.maps.MapTypeId.SATELLITE);
    });
  });

  describe('update', () => {
    test('should allow you to set new options', () => {
      expect(opts.get('zoom')).toEqual(15);
      opts.update({ foo: 'bar' }).update({ zoom: 30 });
      expect(opts.get('foo')).toEqual('bar');
      expect(opts.get('zoom')).toEqual(30);
    });
  });

  describe('addCenter', () => {
    afterEach(() => {
      google.maps.LatLng.mockClear();
    });

    test('should not center if no latlng', () => {
      opts.addCenter();
      expect(google.maps.LatLng).not.toHaveBeenCalled();
      expect(opts.get('center')).toBeUndefined();
    });

    test('should allow you to add center', () => {
      opts.addCenter(1, 2);
      expect(google.maps.LatLng).toHaveBeenCalledWith(1, 2);
      expect(opts.get('center')).toBeDefined();
    });

    test('should allow you to add center from options', () => {
      opts.update({ lat: 1, lng: 2 });
      opts.addCenter();
      expect(google.maps.LatLng).toHaveBeenCalledWith(1, 2);
      expect(opts.get('center')).toBeDefined();
    });
  });
});
