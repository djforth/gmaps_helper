'use strict';

var _ = require('lodash/core');

var createInfoWindow = require('./info_windows'),
    addOpenClose = require('./open_close');

/**
 * Marker module.
 * @module marker
 * @see module:@djforth/googlemap
*/

/** Creates custom map marker */
function setIcon(marker, icon) {
  if (!_.isObject(marker) || !_.isFunction(marker.setIcon)) return;
  if (icon.picture && icon.width && icon.height) {
    marker.setIcon(icon.picture, [icon.width, icon.height]);
  }
}

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
module.exports = function (map, closer, opts) {
  return function (mk) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(mk.lat, mk.lng),
      map: map
    });

    setIcon(marker, mk);
    var infoWindow = createInfoWindow(map, mk.infowindow, opts);

    var infoActions = addOpenClose(map, mk.id, closer);
    infoActions(marker, infoWindow);

    return { marker: marker, info: infoWindow };
  };
};