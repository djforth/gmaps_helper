import partial from 'lodash/partial';

import createPath from './create_gmaps_path';
import getOptions from './options';
// import LazyLoad from './lazyload';
import mapCreator from './create_map';
import mapLoader from './maploader';
import LoadedCallback from './loaded_callback';

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

/* global InfoBubble google */

const findMap = maps => id => {
  const map = maps.find(({ id: mapId }) => id === mapId);
  if (map) return map.options;
};

/**
 * Googlemap module.
 * @module @djforth/googlemap
 */

/**
 * map
 * Will create google map
 *
 * type {function}
 * @param {string} key - Google Map API Key
 * @return {object} of functions to build path
 */
export default key => {
  const lazyload = false;

  const mapEls = [...document.querySelectorAll('[data-map]')];
  if (mapEls.length === 0) return;
  // el = document.getElementById(id);
  // if (!isElement(el)) return;

  const gmapsPath = createPath(key);
  const maps = mapEls.map(el => ({
    options: getOptions(el.dataset.map),
    map: mapCreator(el),
    id: el.id,
  }));

  const finder = findMap(maps);

  const callback = LoadedCallback(maps);
  window.mapLoaded = callback;

  var obj = {
    /** Adds callback to map creation
     * param {function} callback
     */
    addCallback: cb => {
      window.mapLoaded = partial(callback, cb);
      return obj;
    },
    /** Add centre map position
     * param {string} id - id of map
     * param {integer} lat - latitude
     * param {integer} lng - longitude
     */
    addCenter: (id, lat, lng) => {
      const options = finder(id);
      if (!options) return obj;
      options.update({ lat: lat, lng: lng, centermap: true });
      return obj;
    },
    /** Add gmaps config
     * param {object} config object
     */
    addConfig: (id, config) => {
      const options = finder(id);
      if (!options) return obj;
      options.update(config);
      return obj;
    },
    /** Adds lazy load
     * param {string} type - Event type
     */
    // addlazyload: type => {
    //   lazyload = true;
    //   LazyLoad(el, type, removeLoader => {
    //     removeLoader();
    //     mapLoader(gmapsPath.getPath('mapLoaded'))
    //       .addPlugins(options.get('plugins'))
    //       .load();
    //   });
    // },
    /** Adds new google map plugin
     * param {string} type - Event type
     */
    addLibraries: (id, libraries) => {
      const options = finder(id);
      if (!options) return obj;
      options.update({ libraries: libraries });
      return obj;
    },
    /** Sets google map type
     * param {string} type - Map type */
    addType: (id, type) => {
      const options = finder(id);
      if (!options) return obj;
      options.update({ type: type });
      return obj;
    },

    getMaps: () => maps,
    /** Loads map */
    load: () => {
      if (!lazyload) {
        const libraries = maps.reduce((libs, { options }) => libs.concat(options.get('libraries')), []);

        mapLoader(gmapsPath.getPath('mapLoaded'))
          .addPlugins(libraries)
          .load();
      }
    },

    setBounds: id => {
      const options = finder(id);
      if (!options) return obj;
      options.update({ boundmap: true });
      return obj;
    },

    setZoom: (id, z) => {
      const options = finder(id);
      if (!options) return obj;
      options.update({ zoom: z, autozoom: true });
      return obj;
    },
  };

  return obj;
};
