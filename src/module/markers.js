/* global google */
import createInfoWindow from './info_windows';
import addOpenClose from './open_close';

/**
 * Marker module.
 * @module marker
 * @see module:@djforth/googlemap
 */

const checkMarker = marker => typeof marker.setIcon === 'function';

/** Creates custom map marker */
const setIcon = (marker, icon) => {
  if (!checkMarker(marker)) return;
  if (icon.picture && icon.width && icon.height) {
    marker.setIcon(icon.picture, [icon.width, icon.height]);
  }
};

/**
 * map
 * Will create google map marker
 *
 * type {function}
 * @param {function} map - Google map object
 * @param {function} closer - Function to apply close method all to info windows
 * @params {object} info window options
 * @return {object} marker & info(window)
 */
export default (map, closer, opts) => mk => {
  console.log(mk, map);
  const { lng, lat } = mk;
  let marker = new google.maps.Marker({
    position: { lng, lat },
    map: map,
  });

  setIcon(marker, mk);
  let infoWindow = createInfoWindow(map, mk.infowindow, opts);

  if (mk.infowindow) {
    let infoActions = addOpenClose(map, mk.id, closer);
    infoActions(marker, infoWindow);
  }

  return { marker: marker, info: infoWindow };
};
