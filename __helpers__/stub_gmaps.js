import _ from 'lodash';

import mockClass from '@djforth/morse-jasmine-wp/mock_class';

export default (methods)=>{
  let gmap = {maps: {}};

  function addObj(k, v){
    let keys = _.pull(_.keys(v), 'type');
    let obj = jasmine.createSpyObj(v, keys);

    _.forIn(v, (ret, title)=>{
      if (ret.function){
        obj[title].and[ret.function](ret.value);
      }
    });
    return obj;
  }

  function withReturn(title, ret){
    let spy = jasmine.createSpy(title);
    spy.and[ret.function](ret.value);

    return spy;
  }

  _.forIn(methods, (v, k)=>{
    switch (v.type){
      case 'spyObj':
        gmap.maps[k] = addObj(k, v);
        break;
      case 'withReturn':
        gmap.maps[k] = withReturn(k, v);
        break;
      default:
        gmap.maps[k] = jasmine.createSpy(v);
        break;
    }
  });

  return gmap;
};
