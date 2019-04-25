import closeInfo from './close_info';
import markerCreator from './markers';

/* global InfoBubble google */

function makeMarker(createMarker, closer) {
  return function(mk) {
    const marker = createMarker(mk);
    closer.addMarkers(marker);
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
  const bounds = new LatLngBounds();
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
    console.log('options', options.getAll());
    map = new Map(el, options.getAll());

    const closer = closeInfo(map);
    const create = makeMarker(markerCreator(map, closer), closer);

    markers = creator(options.get('pins'), create);

    var obj = {
      centerMap: centerMap(map, markers),
      getMap: () => map,
      setPosition: LatLng => {
        const pos = LatLng({ lat: options.get('lat'), lng: options.get('lng') });
        map.setCenter(pos);
      },
      setZoom: setZoom(map, options.get('zoom')),
    };

    return obj;
  };
};
