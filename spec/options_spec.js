const _         = require("lodash");
const Options = require("../src/options");

var mockGmaps = require("./helpers/stub_gmaps");


describe('options', function() {
  let dataset, opts;
  beforeEach(function() {
    window.google = mockGmaps({
      LatLng:{ type:"withReturn", function:"callFake", value:()=>"lnglat"}
    });
    window.google.maps.MapTypeId = {};

    dataset = JSON.stringify({pins:["pins"], plugins:"/some/plugin"});
    opts = Options(dataset);
  });


  it('should add dataset', function() {
    expect(opts.get("pins")).toEqual(["pins"])
    expect(opts.get("plugins")).toEqual("/some/plugin")
  });

  it('should allow you to get options', function() {
    expect(opts.get("zoom")).toEqual(15);
    expect(_.isObject(opts.getAll())).toBeTruthy();
  });

  describe('addType', function() {
    it('should ROADMAP by default', function() {
      opts.addType()
      expect(opts.get("mapTypeId")).toEqual(google.maps.MapTypeId.ROADMAP)

    });

    it('should all one to be specified', function() {
      opts.addType("SATELLITE");
      expect(opts.get("mapTypeId")).toEqual(google.maps.MapTypeId.SATELLITE)
    });
  });

  describe("update", function() {
    it('should allow you to set new options', function() {
      expect(opts.get("zoom")).toEqual(15);
      opts.update({foo:"bar"}).update({zoom:30});
      expect(opts.get("foo")).toEqual("bar")
      expect(opts.get("zoom")).toEqual(30);
    });
  });

  describe('addCenter', function() {
    it('should allow you to add center', function() {
      opts.addCenter(1,2);
      expect(google.maps.LatLng).toHaveBeenCalledWith(1, 2);
      expect(opts.get("center")).toBeDefined()
    });

    it('should allow you to add center from options', function() {
      opts.update({lat:1, lng:2})
      opts.addCenter();
      expect(google.maps.LatLng).toHaveBeenCalledWith(1, 2);
      expect(opts.get("center")).toBeDefined()
    });

    it('should not center if no latlng', function() {
      opts.addCenter();
      expect(google.maps.LatLng).not.toHaveBeenCalled();
      expect(opts.get("center")).toBeUndefined()
    });
  });



});