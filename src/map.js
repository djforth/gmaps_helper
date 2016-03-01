const _         = require('lodash/core')
    , isElement = require('lodash/isElement')
    , partial   = require('lodash/partial');

const createPath    = require('./create_gmaps_path')
    , getOptions    = require('./options')
    , LazyLoad      = require('./lazyload')
    , mapCreator    = require('./create_map')
    , mapLoader     = require('./maploader');

function creator(map, options){
  return function(cb){
    options.addType().addCenter();
    let m = map(google.maps.Map, options)
        .centerMap(google.maps.LatLngBounds)
        .setZoom(google.maps.event);
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
module.exports = function(id, key){
  let map, options, gpath, lazyload, el;
  lazyload =  false;
  el = document.getElementById(id);

  if (!isElement(el)) return;

  gpath  = createPath(key);
  options    = getOptions(el.dataset.map);
  map        = mapCreator(el);
  window.mapLoaded = creator(map, options);

  var obj = {
    /** Adds callback to map creation
    * param {function} callback
    */
    addCallback: (cb)=>{
      window.mapLoaded = partial(window.mapLoaded, cb);
    }
    /** Add centre map position
    * param {integer} lat - latitude
    * param {integer} lng - longitude
    */
    , addCenter: (lat, lng)=>{
      options.update({lat: lat, lng: lng});
    }
    /** Add gmaps config
    * param {object} config object
    */
    , addConfig: (config)=>{
      options.update(config);
    }
    /** Adds lazy load
     * param {string} type - Event type
    */
    , addlazyload: (type)=>{
      lazyload = true;
      LazyLoad(el, type, (removeLoader)=>{
        removeLoader();
        mapLoader(gpath.getPath('mapLoaded'))
          .addPlugins(options.get('plugins'))
          .load();
      });
    }
    /** Add different gmaps api path - should be create_gmaps_path object
    * param {object} path - New helper path object
     */
    , addPath: (path)=>{
      gpath = path;
    }
    /** Adds new google map plugin
    * param {string} type - Event type
    */
    , addLibraries: (libraries)=>{
      options.update({libraries: libraries});
    }
    /** Sets google map type
    * param {string} type - Map type */
    , addType: (type)=>{
      options.update({type: type});
    }
    /** Loads map */
    , load: ()=>{
      if (!lazyload) {
        mapLoader(gpath.getPath('mapLoaded'))
          .addPlugins(options.get('libraries'))
          .load();
      }
    }
  };

  return obj;
};
