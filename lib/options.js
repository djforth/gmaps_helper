'use strict';

var _ = require('lodash/core');

/* global google */
module.exports = function (dataset) {
  var data;
  if (dataset) {
    data = JSON.parse(dataset);
  }

  var opts = _.defaults(data, {
    autozoom: false,
    boundmap: false,
    centermap: false,
    draggable: true,
    optimized: false,
    mapTypeControl: false,
    scrollwheel: false,
    type: 'ROADMAP',
    zoom: 15,
    zoomControl: true
  });

  var object = {
    addType: function addType(type) {
      type = type || opts.type;
      opts.mapTypeId = google.maps.MapTypeId[type];

      return object;
    },
    addCenter: function addCenter(lat, lng) {
      lat = lat || opts.lat;
      lng = lng || opts.lng;
      if (lat && lng) {
        opts.center = new google.maps.LatLng(lat, lng);
      }

      return object;
    },
    get: function get(key) {
      return opts[key];
    },
    getAll: function getAll() {
      return opts;
    },
    update: function update(config) {
      opts = _.defaults(config, opts);
      return object;
    }
  };

  return object;
};