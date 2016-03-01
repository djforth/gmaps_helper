const _         = require("lodash");
const Maploader = require("../src/maploader");

const checkCalls = require("@djforth/morse-jasmine/check_calls")
  , createEl = require("@djforth/morse-jasmine/create_elements").createHolder
  , removeEl = require("@djforth/morse-jasmine/create_elements").removeElement
  , stubs = require("@djforth/morse-jasmine/stub_inner")(Maploader);

describe('maploader', function() {
  describe('createScript', function() {
    let createScript, script;
    createScript =  Maploader.__get__("createScript");

    beforeEach(function() {
      script = createScript("/path/to/js", "foo");
    });

    afterEach(function() {
      stubs.revertAll();
    });

    it('should return a html element', function() {
      expect(_.isElement(script)).toBeTruthy();
    });

    it('should set src correctly', function() {
      expect(script.src).toContain("/path/to/js");
    });

    it('should set id', function() {
      expect(script.id).toEqual("foo");
    });
  });

  describe('loadPlugins', function() {
    let loadPlugins = Maploader.__get__("loadPlugins");
    beforeEach(function() {

      stubs.addSpy(["createScript"]);
      stubs.getSpy("createScript").and.callFake((path, id)=>{
         var script  = document.createElement("script");
        script.className = "pluginScripts";
        script.id   = id
        script.type = "text/javascript";
        script.src  = "path/to/js";

        return script;
      });
    });

    afterEach(()=>{
      stubs.getSpy("createScript").calls.reset()
      stubs.revertAll();

      let elements = document.querySelectorAll(".pluginScripts");
      _.forEach(elements, (el)=>{
        removeEl(el);
      });
    });

    it('not call create script if not array', function() {
      loadPlugins("foo")
      expect(stubs.getSpy("createScript")).not.toHaveBeenCalled()
    });

    it('not call create script if empty array', function() {
      loadPlugins([])
      expect(stubs.getSpy("createScript")).not.toHaveBeenCalled()
    });

    it('not call create script if array of undefined', function() {
      loadPlugins([undefined])
      expect(stubs.getSpy("createScript")).not.toHaveBeenCalled()
    });



    checkCalls(()=>{
      loadPlugins(["my/plugin"]);
      return stubs.getSpy("createScript")
    }, "createsScript", ()=>["my/plugin", "plugin0"]);

  });

  // describe('loadmap data', function() {
  //   let plugins, spy, revert, loader;
  //   beforeEach(function() {

  //     stubs.addSpy(["createScript", "loadPlugins"]);
  //     stubs.getSpy("createScript").and.callFake((path, id)=>{
  //        var script  = document.createElement("script");
  //       script.className = "gmapsScripts";
  //       script.id   = id
  //       script.type = "text/javascript";
  //       script.src  = "path/to/js";

  //       return script;
  //     });
  //     // revert = Maploader.__set__("createScript", spy);
  //     loader = Maploader("gmaps/path");

  //   });

  //   afterEach(()=>{
  //     stubs.revertAll();
  //     let elements = document.querySelectorAll(".gmapsScripts");
  //     _.forEach(elements, (el)=>{
  //       removeEl(el);
  //     })
  //   })

  //   checkCalls(()=>{
  //     loader.load();
  //     return stubs.getSpy("createScript")
  //   }, "createsScript", ()=>["gmaps/path"]);

  //   checkCalls(()=>{
  //     loader.addPlugins("plugin/path")
  //     loader.load();
  //     return stubs.getSpy("loadPlugins")
  //   }, "loadPlugins", ()=>[["plugin/path"]]);
  // });
});