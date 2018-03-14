import _ from 'lodash';
import GmapsPath from 'create_gmaps_path';

describe('create_gmaps_path', () => {
  let gmaps_path, path;
  describe('if no libraries or region added', () => {
    beforeEach(() => {
      gmaps_path = GmapsPath('mykey');
      path = gmaps_path.getPath('my_callback');
    });

    test('should return the correct key', () => {
      expect(path).toContain('key=mykey');
    });

    test('should return the correct region code', () => {
      expect(path).toContain('region=uk');
    });

    test('should not return the any libraries', () => {
      expect(path).not.toContain('&libraries=');
    });

    test('should return the correct callback', () => {
      expect(path).toContain('&callback=my_callback');
    });
  });

  describe('if libraries & region added', () => {
    beforeEach(() => {
      gmaps_path = GmapsPath('mykey');
      path = gmaps_path
        .addLibrary('some-lib')
        .addLibrary('another-lib')
        .addRegion('es')
        .getPath('my_callback');
    });

    test('should return the correct key', () => {
      expect(path).toContain('key=mykey');
    });

    test('should not return the any libraries', () => {
      expect(path).toContain('&libraries=some-lib,another-lib');
    });

    test('should return the correct region code', () => {
      expect(path).toContain('region=es');
    });

    test('should return the correct callback', () => {
      expect(path).toContain('&callback=my_callback');
    });
  });
});
