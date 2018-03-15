/* global InfoBubble google */

export default maps => {
  let m = Array.isArray(maps) ? maps : [maps];
  return function(cb) {
    const gmaps = m.map(({ map, options }) => {
      options.addType();
      options.addCenter();
      const gmap = map(google.maps.Map, options);
      if (options.get('boundmap')) {
        gmap.centerMap(google.maps.LatLngBounds);
      }
      if (options.get('autozoom')) {
        gmap.setZoom(google.maps.event);
      }
      return gmap.getMap();
    });

    if (typeof cb === 'function') cb(gmaps);
  };
};
