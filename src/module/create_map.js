import closeInfo from './close_info';
import markerCreator from './markers';

/* global InfoBubble google */

function makeMarker(createMarker, closer) {
  return function(mk) {
    let marker = createMarker(mk);
    closer.addMarkers(marker);
    console.log(marker);
    return marker;
  };
}

function creator(markers, create) {
  if (Array.isArray(markers)) {
    return markers.map(mk => create(mk));
  }
  return [create(markers)];
}

const centerMap = (map, markers) => LatLngBounds => {
  let bounds = new LatLngBounds();
  markers.forEach(mk => {
    bounds.extend(mk.marker.getPosition());
  });

  map.fitBounds(bounds);
};

const setZoom = (map, zoom) => event => {
  var listener = event.addListener(map, 'idle', () => {
    if (map.getZoom() !== zoom) {
      map.setZoom(zoom);
    }
    event.removeListener(listener);
  });
};

// return this.obj;

export default el => {
  let map, markers;
  if (!el) return null;
  return (Map, options) => {
    // Should tweak this - not side effect free
    map = new google.maps.Map(el, options.getAll());

    let closer = closeInfo(map);
    let create = makeMarker(markerCreator(map, closer), closer);

    markers = creator(options.get('pins'), create);

    var obj = {
      centerMap: centerMap(map, markers),
      getMap: () => map,
      setPosition: LatLng => {
        let pos = LatLng({ lat: options.get('lat'), lng: options.get('lng') });
        map.setCenter(pos);
      },
      setZoom: setZoom(map, options.get('zoom')),
    };

    return obj;
  };
};
