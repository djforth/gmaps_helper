/* global google */
const setDefaults = ({ pins: dataPins, lng, lat }) => {
  const pins = Array.isArray(dataPins) ? dataPins : [dataPins];
  if (pins.length === 0) return { pins };
  console.log(pins);
  if (pins.length > 1 && !lng && !lat) {
    return {
      pins,
      boundmap: true,
    };
  }

  if (lng && lat) {
    return {
      pins,
      lng,
      lat,
    };
  }

  return {
    pins,
    lng: pins[0].lng,
    lat: pins[0].lat,
  };
};

export default dataset => {
  var data;

  if (dataset) {
    data = JSON.parse(dataset);
  }

  let opts = {
    autozoom: false,
    boundmap: false,
    centermap: false,
    draggable: true,
    optimized: false,
    mapTypeControl: false,
    scrollwheel: false,
    type: 'ROADMAP',
    zoom: 15,
    zoomControl: true,
    ...data,
    ...setDefaults(data),
  };

  const object = {
    addType: type => {
      const newType = type || opts.type;
      opts.mapTypeId = google.maps.MapTypeId[newType];

      return object;
    },
    addCenter: (lat, lng) => {
      const newLat = lat || opts.lat;
      const newLng = lng || opts.lng;

      opts.center = new google.maps.LatLng(newLat, newLng);

      return object;
    },
    get: key => opts[key],
    getAll: () => opts,
    update: config => {
      opts = { ...opts, ...config };
      return object;
    },
  };

  return object;
};
