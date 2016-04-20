'use strict';

var _ = require('lodash/core'),
    isElement = require('lodash/isElement'),
    partial = require('lodash/partial');

var createPath = require('./create_gmaps_path'),
    getOptions = require('./options'),
    LazyLoad = require('./lazyload'),
    mapCreator = require('./create_map'),
    mapLoader = require('./maploader');

/* global InfoBubble google */

function creator(map, options) {
  var m = undefined;
  return function (cb) {
    options.addType().addCenter();
    m = map(google.maps.Map, options);
    if (options.get('boundmap')) {
      m.centerMap(google.maps.LatLngBounds);
    }

    if (options.get('autozoom')) {
      m.setZoom(google.maps.event);
    }

    if (_.isFunction(cb)) cb(m.getMap());
  };
}

/**
 * Googlemap module.
 * @module @djforth/googlemap
*/

/**
 * map
 * Will create google map
 *
 * type {function}
 * @param {string} id - html ID where map will be places.
 * @param {string} key - Google Map API Key
 * @return {object} of functions to build path
 */
module.exports = function (id, key) {
  var map = undefined,
      options = undefined,
      gpath = undefined,
      lazyload = undefined,
      el = undefined;
  lazyload = false;
  el = document.getElementById(id);

  if (!isElement(el)) return;

  gpath = createPath(key);
  options = getOptions(el.dataset.map);
  map = mapCreator(el);
  window.mapLoaded = creator(map, options);

  var obj = {
    /** Adds callback to map creation
    * param {function} callback
    */
    addCallback: function addCallback(cb) {
      window.mapLoaded = partial(window.mapLoaded, cb);
    }
    /** Add centre map position
    * param {integer} lat - latitude
    * param {integer} lng - longitude
    */
    , addCenter: function addCenter(lat, lng) {
      options.update({ lat: lat, lng: lng, centermap: true });
    }
    /** Add gmaps config
    * param {object} config object
    */
    , addConfig: function addConfig(config) {
      options.update(config);
    }
    /** Adds lazy load
     * param {string} type - Event type
    */
    , addlazyload: function addlazyload(type) {
      lazyload = true;
      LazyLoad(el, type, function (removeLoader) {
        removeLoader();
        mapLoader(gpath.getPath('mapLoaded')).addPlugins(options.get('plugins')).load();
      });
    }
    /** Add different gmaps api path - should be create_gmaps_path object
    * param {object} path - New helper path object
     */
    , addPath: function addPath(path) {
      gpath = path;
    }
    /** Adds new google map plugin
    * param {string} type - Event type
    */
    , addLibraries: function addLibraries(libraries) {
      options.update({ libraries: libraries });
    }
    /** Sets google map type
    * param {string} type - Map type */
    , addType: function addType(type) {
      options.update({ type: type });
    }
    /** Loads map */
    , load: function load() {
      if (!lazyload) {
        mapLoader(gpath.getPath('mapLoaded')).addPlugins(options.get('libraries')).load();
      }
    },

    setBounds: function setBounds() {
      options.update({ boundmap: true });
    },

    setZoom: function setZoom(z) {
      options.update({ zoom: z, autozoom: true });
    }
  };

  return obj;
};