'use strict';

var _ = require('lodash/core');
/**
* Google Maps path module.
* @module close_info
* @see module:@djforth/gmaps_helper
* Sets close info windows
*
* type {function}
* @param {object} Map - Google Map Object
* @return {object} of functions to build path
*/

module.exports = function closeInfo(map) {
  var markers = [];
  return {
    /** Add markers to list
    * @param {array} or Object m - marker array or Object
    */
    addMarkers: function addMarkers(m) {
      if (_.isArray(m)) {
        markers = markers.concat(m);
        return;
      }

      markers.push(m);
    }
    /** Close all windows */
    , closeAllWindows: function closeAllWindows() {
      _.forEach(markers, function (mk) {
        if (_.has(mk, 'info') && _.has(mk, 'marker')) {
          mk.info.close(map, mk.marker);
        }
      });
    }
    /** Returns mark list
    * @return {array} - markers array
    */
    , getAll: function getAll() {
      return markers;
    }
  };
};