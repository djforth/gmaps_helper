const _ = require("lodash");

var mockClass = require("@djforth/morse-jasmine/mock_class");



module.exports = function mockGmaps(methods){
  let gmap = {maps:{}}

  function addObj(k, v){
    let keys = _.pull(_.keys(v), "type");
    let obj = jasmine.createSpyObj(v, keys);

    _.forIn(v, (ret, title)=>{
      if(ret.function){
        obj[title].and[ret.function](ret.value);
      }
    })
    return obj
  }

  function withReturn(title, ret) {
    let spy = jasmine.createSpy(title);
    spy.and[ret.function](ret.value);

    return spy;
  }

  _.forIn(methods, (v, k)=>{
    switch(v.type){
      case "spyObj":
        gmap.maps[k] = addObj(k, v);
      break;
      case "withReturn":
        gmap.maps[k] = withReturn(k, v);
      break;
      default:
        gmap.maps[k] = jasmine.createSpy(v);
      break;
    }

  })

  return gmap;
}