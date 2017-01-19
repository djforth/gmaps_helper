'use strict';

var _ = require('lodash/core'),
    bind = require('lodash/bind'),
    partial = require('lodash/partial');

var closeInfo = require('./close_info'),
    markerCreator = require('./markers');

/* global InfoBubble google */

function makeMarker(createMarker, closer) {
  return function (mk) {
    var marker = createMarker(mk);

    closer.addMarkers(marker);
    return marker;
  };
}

function creator(markers, create) {
  if (_.isArray(markers)) {
    markers = _.map(markers, function (mk) {
      return create(mk);
    });
  } else {
    markers = [create(markers)];
  }

  return markers;
}

function centerMap(map, markers, LatLngBounds) {
  var bounds = new LatLngBounds();
  _.forEach(markers, function (mk) {
    bounds.extend(mk.marker.getPosition());
  });

  map.fitBounds(bounds);
  return this.obj;
}

function setZoom(map, zoom, event) {
  var listener = event.addListener(map, 'idle', function () {
    if (this.getZoom() !== zoom) {
      this.setZoom(zoom);
    }
    event.removeListener(listener);
  });

  return this.obj;
}

module.exports = function (el) {
  var map = void 0,
      markers = void 0;

  return function (Map, options) {
    // Should tweak this - not side effect free
    map = new Map(el, options.getAll());
    var closer = closeInfo(map);
    var create = makeMarker(markerCreator(map, closer), closer);

    markers = creator(options.get('pins'), create);
    var obj = {
      getMap: function getMap() {
        return map;
      },
      setPosition: function setPosition(LatLng) {
        var pos = LatLng({ lat: options.get('lat'), lng: options.get('lng') });
        map.setCenter(pos);
      }
    };

    obj.centerMap = partial(bind(centerMap, { obj: obj }), map, markers);
    obj.setZoom = partial(bind(setZoom, { obj: obj }), map, options.get('zoom'));
    return obj;
  };
};