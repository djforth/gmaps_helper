
const _         = require("lodash");
const GmapsPath = require("../src/create_gmaps_path");


describe('create_gmaps_path', function() {
  let gmaps_path, path;
  describe('if no libraries or region added', function() {
    beforeEach(function () {
      gmaps_path = GmapsPath("mykey");
      path = gmaps_path.getPath("my_callback");
    });

    it('should return the correct key', function() {
      expect(path).toContain("key=mykey")
    });

    it('should return the correct region code', function() {
      expect(path).toContain("region=uk")
    });

    it('should not return the any libraries', function() {
      expect(path).not.toContain("&libraries=")
    });

    it('should return the correct callback', function() {
      expect(path).toContain("&callback=my_callback")
    });
  });

  describe('if libraries & region added', function() {
    beforeEach(function () {
      gmaps_path = GmapsPath("mykey");
      path = gmaps_path
              .addLibrary("some-lib")
              .addLibrary("another-lib")
              .addRegion("es")
              .getPath("my_callback");
    });

    it('should return the correct key', function() {
      expect(path).toContain("key=mykey")
    });

    it('should not return the any libraries', function() {
      expect(path).toContain("&libraries=some-lib,another-lib")
    });

    it('should return the correct region code', function() {
      expect(path).toContain("region=es")
    });

    it('should return the correct callback', function() {
      expect(path).toContain("&callback=my_callback")
    });
  });
});