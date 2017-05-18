import _ from 'lodash';
import bind from 'lodash/bind';
import partial from 'lodash/partial';

import closeInfo from './close_info';
import markerCreator from './markers';

/* global InfoBubble google */

function makeMarker(createMarker, closer){
  return function(mk){
    let marker = createMarker(mk);

    closer.addMarkers(marker);
    return marker;
  };
}

function creator(markers, create){
  if (_.isArray(markers)){
    markers = _.map(markers, (mk)=>{
      return create(mk);
    });
  } else {
    markers = [create(markers)];
  }

  return markers;
}

function centerMap(map, markers, LatLngBounds){
  let bounds = new LatLngBounds();
  _.forEach(markers, (mk)=>{
    bounds.extend(mk.marker.getPosition());
  });

  map.fitBounds(bounds);
  return this.obj;
}

function setZoom(map, zoom, event){
  var listener = event.addListener(map, 'idle', function(){
    if (this.getZoom() !== zoom){
      this.setZoom(zoom);
    }
    event.removeListener(listener);
  });

  return this.obj;
}

export default (el)=>{
  let map, markers;

  return (Map, options)=>{
    // Should tweak this - not side effect free
    map = new Map(el, options.getAll());
    let closer = closeInfo(map);
    let create = makeMarker(markerCreator(map, closer), closer);

    markers = creator(options.get('pins'), create);
    var obj = {
      getMap: ()=>map
      , setPosition: (LatLng)=>{
        let pos = LatLng({lat: options.get('lat'), lng: options.get('lng')});
        map.setCenter(pos);
      }
    };

    obj.centerMap = partial(bind(centerMap, {obj: obj}), map, markers);
    obj.setZoom = partial(bind(setZoom, {obj: obj}), map, options.get('zoom'));
    return obj;
  };
};
