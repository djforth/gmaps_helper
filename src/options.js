import _ from 'lodash';

/* global google */
export default (dataset)=>{
  var data;
  if (dataset){
    data = JSON.parse(dataset);
  }

  let opts = _.defaults(data, {
    autozoom: false
    , boundmap: false
    , centermap: false
    , draggable: true
    , optimized: false
    , mapTypeControl: false
    , scrollwheel: false
    , type: 'ROADMAP'
    , zoom: 15
    , zoomControl: true
  });

  let object = {
    addType: (type)=>{
      type = type || opts.type;
      opts.mapTypeId = google.maps.MapTypeId[type];

      return object;
    }
    , addCenter: (lat, lng)=>{
      lat = lat || opts.lat;
      lng = lng || opts.lng;
      if (lat && lng){
        opts.center = new google.maps.LatLng(lat, lng);
      }

      return object;
    }
    , get: (key)=>opts[key]
    , getAll: ()=>opts
    , update: (config)=>{
      opts = _.defaults(config, opts);
      return object;
    }
  };

  return object;
};
