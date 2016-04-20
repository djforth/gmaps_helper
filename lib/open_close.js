'use strict';

var _ = require('lodash/core');
/* global google InfoBubble */
function addClose(map, id) {
  return function (marker, infowindow) {
    var elem = document.getElementById('pin-' + id);
    if (_.isNull(elem)) return null;

    google.maps.event.addDomListener(elem, 'click', function (e) {
      e.preventDefault();
      infowindow.close(map, marker);
    });
  };
}

module.exports = function addOpenClose(map, id, closer) {
  var close = addClose(map, id);

  return function (marker, infowindow) {
    google.maps.event.addListener(marker, 'click', function () {
      closer.closeAllWindows();
      infowindow.open(map, marker);

      if (typeof InfoBubble !== 'undefined') {
        google.maps.event.trigger(map, 'resize');
        _.delay(function () {
          close(marker, infowindow);
        }, 500);
      }
    });
  };
};