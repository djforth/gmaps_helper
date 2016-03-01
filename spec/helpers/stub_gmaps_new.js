const _ = require("lodash");

var MockClass = require("@djforth/morse-jasmine/mock_class");

function withReturn(spy, type, value) {
  spy.and[type](value);
}

function addMethods(ClassConst, methods){
  return _.map(methods, (m)=>{
    let title = (_.isString(m)) ? m : m.title
    let spy = jasmine.createSpy(title)
    if(m.value && m.type) withReturn(spy, m.type, m.value)
    ClassConst.prototype[title] = spy
    return {title:title, spy:spy};
  });
}

function fakeConstructor(methods, title){
  var init  = jasmine.createSpy("init");
  let spies = [{title:"init", spy:init}]
  var ClassConst = function(){
    init.apply(this, arguments);
  }

  if(_.isArray(methods) && !_.isEmpty(methods)){
     spies = spies.concat(addMethods(ClassConst, methods));
  }

  return {mock:ClassConst, spies:spies}
}

function getSpy(list, class_name, spy_name){
  let spies = _.find(list, (l)=>l.title === class_name).spies
  return _.find(spies, (spy)=>spy.title === spy_name).spy
}


module.exports = function(){

  let gmap = window.google = {maps:{}}
  let spies = [];

  var obj = {
    addConstructor:(title, methods)=>{
      let fake_class = fakeConstructor(methods, title)
      gmap.maps[title] = fake_class.mock;
      spies.push({title:title, spies:fake_class.spies})
      return obj;
    }
    , getConstructorSpy:(title)=>{
      return getSpy(spies, title, "init")
    }
    , getSpy:(title, spy_name)=>{
      return getSpy(spies, title, spy_name)
    }
    , removeAll:()=>{
      spies = [];
    }
  }

  return obj;
}